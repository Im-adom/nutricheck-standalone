const { Groq } = require('groq-sdk');
const https = require('https');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const STOP_WORDS = new Set([
  'is', 'are', 'was', 'be', 'been', 'the', 'and', 'for', 'that', 'this',
  'with', 'from', 'not', 'but', 'have', 'had', 'what', 'when', 'which',
  'than', 'then', 'them', 'they', 'will', 'can', 'more', 'also', 'into',
  'very', 'just', 'like', 'its', 'does', 'did', 'has', 'your', 'our'
]);

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function searchPubMed(query, maxResults = 10) {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${maxResults}&retmode=json&tool=nutricheck&email=nutricheck@example.com`;
  return httpGet(url)
    .then(data => JSON.parse(data).esearchresult?.idlist || [])
    .catch(() => []);
}

// Try multiple query strategies until we get results
async function searchPubMedWithFallback(claim, topic) {
  const words = claim.toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOP_WORDS.has(w));

  const topicLabel = topic.replace(/_/g, ' ');

  const queries = [
    words.slice(0, 6).join(' ') + ' nutrition',
    words.slice(0, 4).join(' ') + ' diet health',
    topicLabel + ' nutrition evidence',
    topicLabel + ' diet',
    words.slice(0, 3).join(' '),
  ];

  for (const q of queries) {
    if (!q.trim()) continue;
    const pmids = await searchPubMed(q, 10);
    if (pmids.length > 0) return pmids;
  }
  return [];
}

function fetchSummary(pmids) {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmids.join(',')}&retmode=json&tool=nutricheck&email=nutricheck@example.com`;
  return httpGet(url)
    .then(d => JSON.parse(d))
    .catch(() => ({ result: { uids: [] } }));
}

function fetchAbstracts(pmids) {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmids.join(',')}&rettype=abstract&retmode=xml&tool=nutricheck&email=nutricheck@example.com`;
  return httpGet(url).then(xml => {
    const abstracts = {};
    const articleRe = /<PubmedArticle>([\s\S]*?)<\/PubmedArticle>/g;
    let m;
    while ((m = articleRe.exec(xml)) !== null) {
      const block = m[1];
      const pmidMatch = block.match(/<PMID[^>]*>(\d+)<\/PMID>/);
      if (!pmidMatch) continue;
      const parts = [];
      const absRe = /<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g;
      let a;
      while ((a = absRe.exec(block)) !== null) {
        parts.push(a[1].replace(/<[^>]+>/g, '').trim());
      }
      abstracts[pmidMatch[1]] = parts.join(' ') || 'No abstract available';
    }
    return abstracts;
  }).catch(() => ({}));
}

async function getPubMedDetails(pmids) {
  if (pmids.length === 0) return [];
  const [summary, abstracts] = await Promise.all([fetchSummary(pmids), fetchAbstracts(pmids)]);
  return (summary.result?.uids || []).map(uid => {
    const paper = summary.result[uid];
    return {
      pmid: uid,
      title: paper.title || 'N/A',
      abstract: abstracts[uid] || 'No abstract available',
      authors: paper.authors?.map(a => a.name).join(', ') || 'Unknown',
      pubDate: paper.pubdate || 'Unknown',
      articleType: classifyArticleType(paper),
      url: `https://pubmed.ncbi.nlm.nih.gov/${uid}/`
    };
  });
}

function classifyArticleType(paper) {
  const types = paper.pubtype || [];
  if (types.some(t => t.includes('Meta-Analysis') || t.includes('Systematic Review'))) return 'Systematic Review/Meta-analysis';
  if (types.some(t => t.includes('Randomized Controlled Trial'))) return 'RCT';
  if (types.some(t => t.includes('Clinical Trial'))) return 'Clinical Trial';
  if (types.some(t => t.includes('Review'))) return 'Review';
  return 'Observational Study';
}

function scoreEvidenceStrength(papers) {
  if (papers.length === 0) return { percentage: 0, strength: 'No Data', breakdown: { systematicReviews: 0, rcts: 0, clinicalTrials: 0, reviews: 0, observational: 0 }, totalPapers: 0 };

  let totalWeight = 0;
  const breakdown = { systematicReviews: 0, rcts: 0, clinicalTrials: 0, reviews: 0, observational: 0 };

  papers.forEach(paper => {
    let weight = 3;
    if (paper.articleType.includes('Systematic Review') || paper.articleType.includes('Meta-analysis')) {
      weight = 10; breakdown.systematicReviews++;
    } else if (paper.articleType === 'RCT') {
      weight = 8; breakdown.rcts++;
    } else if (paper.articleType === 'Clinical Trial') {
      weight = 7; breakdown.clinicalTrials++;
    } else if (paper.articleType === 'Review') {
      weight = 5; breakdown.reviews++;
    } else {
      breakdown.observational++;
    }
    totalWeight += weight;
  });

  const strengthPercentage = Math.min(100, (totalWeight / (papers.length * 10)) * 100);
  let strength = 'Weak';
  if (strengthPercentage >= 70) strength = 'Strong';
  else if (strengthPercentage >= 40) strength = 'Moderate';

  return { percentage: Math.round(strengthPercentage), strength, breakdown, totalPapers: papers.length };
}

async function analyzeClaimWithLLM(claim, papers) {
  try {
    const hasPapers = papers.length > 0;

    const papersSection = hasPapers
      ? papers.map((p, i) =>
          `[${i + 1}] ${p.title} (${p.pubDate})\n    Type: ${p.articleType}\n    Abstract: ${p.abstract.substring(0, 350)}...`
        ).join('\n\n')
      : null;

    const systemMsg = `You are a board-certified nutrition scientist and fact-checker.
Your job is to evaluate nutrition claims and return a JSON verdict.
RULES:
- You MUST always choose exactly one verdict: TRUE, MISLEADING, or FALSE. Never say UNKNOWN.
- TRUE = claim is accurate and well-supported by scientific evidence. Use this when the claim is factually correct.
- FALSE = claim is directly contradicted by scientific evidence. Use this when the claim is factually wrong.
- MISLEADING = claim has partial truth but is oversimplified, exaggerated, lacks important context, or applies only in specific circumstances.
- Base your verdict strictly on the scientific evidence. Do not favour any particular verdict — choose whichever best fits the evidence.
- Provide a concise explanation (2-3 sentences) justifying your verdict, referencing specific studies if available.
- Assess your confidence in the verdict as HIGH, MEDIUM, or LOW based on the quality and quantity of evidence.
- If no specific studies are available, rely on established scientific consensus and general nutritional knowledge to evaluate the claim.`;

    const userMsg = hasPapers
      ? `Analyze this nutrition claim using the research papers below.

CLAIM: "${claim}"

RESEARCH PAPERS RETRIEVED FROM PUBMED:
${papersSection}

Return JSON:
{"verdict":"TRUE|MISLEADING|FALSE","explanation":"2-3 sentence explanation","confidence":"HIGH|MEDIUM|LOW"}`
      : `Analyze this nutrition claim using your nutrition science expertise.
No PubMed papers were retrieved, so use established scientific consensus.

CLAIM: "${claim}"

Return JSON (note in your explanation that no specific studies were found):
{"verdict":"TRUE|MISLEADING|FALSE","explanation":"2-3 sentence explanation mentioning general nutritional knowledge","confidence":"LOW|MEDIUM"}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemMsg },
        { role: 'user', content: userMsg }
      ],
      model: 'llama3-70b-8192',
      temperature: 0.2,
      max_tokens: 400,
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

    const validVerdicts = ['TRUE', 'MISLEADING', 'FALSE'];
    const verdict = validVerdicts.includes(parsed.verdict) ? parsed.verdict : 'MISLEADING';

    return {
      verdict,
      explanation: parsed.explanation || 'Based on nutritional science, this claim requires more context to evaluate accurately.',
      confidence: parsed.confidence || 'LOW'
    };
  } catch (error) {
    console.error('LLM Error:', error);
    return {
      verdict: 'MISLEADING',
      explanation: 'This claim could not be fully verified. Nutrition science is nuanced — consult a registered dietitian for personalized advice.',
      confidence: 'LOW'
    };
  }
}

function autoDetectTopic(claim) {
  const lowerClaim = claim.toLowerCase();
  const topics = {
    'eggs': ['eggs', 'egg'],
    'yogurt': ['yogurt', 'greek yogurt'],
    'rice': ['rice', 'brown rice', 'white rice', 'cauliflower rice'],
    'meat': ['steak', 'beef', 'strip', 'sirloin', 'chicken'],
    'weight_loss': ['weight loss', 'lose weight', 'fat loss'],
    'diet': ['diet', 'dieting', 'eating', 'meal'],
    'fiber': ['fiber', 'fibre'],
    'fruits': ['fruit', 'fruits', 'apple', 'orange', 'banana'],
    'digestion': ['digestion', 'digest', 'indigestion'],
    'sleep': ['sleep', 'bed', 'energy', 'tired'],
    'heart': ['heart', 'cholesterol', 'blood pressure', 'artery'],
    'kidney': ['kidney', 'renal'],
    'skin': ['skin', 'acne', 'glow'],
    'protein': ['protein', 'amino acid'],
    'supplements': ['supplement', 'vitamins', 'minerals'],
    'processed': ['processed', 'frozen', 'packaged']
  };
  for (const [topic, keywords] of Object.entries(topics)) {
    if (keywords.some(k => lowerClaim.includes(k))) return topic;
  }
  return 'general_nutrition';
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const { claim } = req.body;
    if (!claim || claim.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Claim is required' });
    }

    const topic = autoDetectTopic(claim);

    // Search PubMed with multiple fallback strategies
    const pmids = await searchPubMedWithFallback(claim, topic);
    const papers = await getPubMedDetails(pmids);
    const evidence = scoreEvidenceStrength(papers);

    // Always analyze with LLM — with papers if found, from knowledge if not
    const analysis = await analyzeClaimWithLLM(claim, papers);

    return res.status(200).json({
      success: true,
      claim,
      topic,
      verdict: analysis.verdict,
      explanation: analysis.explanation,
      confidence: analysis.confidence,
      evidence,
      papers: papers.map(p => ({
        pmid: p.pmid,
        title: p.title,
        authors: p.authors,
        pubDate: p.pubDate,
        articleType: p.articleType,
        abstract: p.abstract,
        url: p.url
      }))
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Analysis failed' });
  }
};
