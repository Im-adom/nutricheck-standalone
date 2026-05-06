const https = require('https');

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function searchPubMed(query, maxResults = 10) {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${maxResults}&retmode=json&tool=nutricheck&email=nutricheck@example.com`;
  return httpGet(url).then(data => {
    const result = JSON.parse(data);
    return result.esearchresult?.idlist || [];
  });
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
  const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmids.join(',')}&retmode=json&tool=nutricheck&email=nutricheck@example.com`;
  const [summaryData, abstracts] = await Promise.all([
    httpGet(summaryUrl).then(d => JSON.parse(d)).catch(() => ({ result: { uids: [] } })),
    fetchAbstracts(pmids)
  ]);
  return (summaryData.result?.uids || []).map(uid => {
    const paper = summaryData.result[uid];
    return {
      pmid: uid,
      title: paper.title || 'N/A',
      abstract: abstracts[uid] || 'No abstract available',
      authors: paper.authors?.map(a => a.name).join(', ') || 'Unknown',
      pubDate: paper.pubdate || 'Unknown',
      source: paper.source || 'PubMed',
      articleType: paper.pubtype || [],
      url: `https://pubmed.ncbi.nlm.nih.gov/${uid}/`
    };
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Query required' });

    const pmids = await searchPubMed(query, 10);
    const papers = await getPubMedDetails(pmids);

    res.status(200).json({ success: true, query, paperCount: papers.length, papers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
