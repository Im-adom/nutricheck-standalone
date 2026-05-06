const API_URL = window.location.origin + '/api';
let analysisHistory = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  loadHistory();
  setupEventListeners();
});

function setupEventListeners() {
  const claimInput = document.getElementById('claimInput');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');

  claimInput.addEventListener('input', () => {
    document.getElementById('charCount').textContent = claimInput.value.length;
    analyzeBtn.disabled = claimInput.value.trim().length === 0;
  });

  analyzeBtn.addEventListener('click', () => analyzeClaim());
  clearHistoryBtn.addEventListener('click', () => clearHistory());

  // Disable button initially
  analyzeBtn.disabled = true;
}

async function analyzeClaim() {
  const claim = document.getElementById('claimInput').value.trim();

  if (!claim) {
    alert('Please enter a nutrition claim');
    return;
  }

  showLoadingModal();

  try {
    const response = await fetch(API_URL + '/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claim })
    });

    const data = await response.json();

    hideLoadingModal();

    if (data.success) {
      displayResult(data);
      addToHistory(data);
      document.getElementById('claimInput').value = '';
      document.getElementById('charCount').textContent = '0';
    } else {
      alert('Error: ' + data.error);
    }
  } catch (error) {
    hideLoadingModal();
    alert('Failed to analyze claim: ' + error.message);
    console.error(error);
  }
}

function displayResult(data) {
  const resultContainer = document.getElementById('resultContainer');

  const verdictEmojis = { TRUE: '✅', MISLEADING: '⚠️', FALSE: '❌' };
  const verdictClass  = { TRUE: 'true', MISLEADING: 'misleading', FALSE: 'false' };
  const confidenceLabels = { HIGH: '● High confidence', MEDIUM: '◑ Medium confidence', LOW: '○ Low confidence' };

  const vClass = verdictClass[data.verdict] || 'unknown';
  const vEmoji = verdictEmojis[data.verdict] || '❓';
  const vConf  = confidenceLabels[data.confidence] || data.confidence;

  const papersHtml = data.papers.length > 0
    ? data.papers.map((paper, i) => `
        <div class="paper-item">
          <div class="paper-title">${i + 1}. ${escapeHtml(paper.title)}</div>
          <div class="paper-meta">
            <span class="paper-type">${escapeHtml(paper.articleType)}</span>
            ${escapeHtml(paper.pubDate)}${paper.authors ? ' · ' + escapeHtml(paper.authors.split(',')[0]) + ' et al.' : ''}
          </div>
          <div class="paper-meta">${escapeHtml(paper.abstract.substring(0, 160))}…</div>
          <a href="${paper.url}" target="_blank" rel="noopener" class="paper-link">Read on PubMed →</a>
        </div>`)
      .join('')
    : '<p class="empty-state">No specific papers retrieved — analysis based on nutritional science consensus.</p>';

  const html = `
    <div class="result-card">

      <div class="result-claim">
        <p>Claim analyzed:</p>
        <div class="claim-text">"${escapeHtml(data.claim)}"</div>
      </div>

      <div class="result-verdict ${vClass}">
        <div class="verdict-icon">${vEmoji}</div>
        <div class="verdict-content">
          <div class="verdict-label">Verdict</div>
          <div class="verdict-text">${data.verdict}</div>
          <div class="verdict-label" style="margin-top:4px">${vConf}</div>
        </div>
      </div>

      <div class="evidence-section">
        <h3>Evidence Strength</h3>
        <div id="gaugeChart"></div>
        <div class="evidence-details">
          <div class="evidence-detail-row">
            <span class="label">Papers Found</span>
            <span class="value">${data.evidence.totalPapers}</span>
          </div>
          <div class="evidence-detail-row">
            <span class="label">Evidence Quality</span>
            <span class="value">${data.evidence.strength}</span>
          </div>
          <div class="evidence-detail-row">
            <span class="label">Quality Score</span>
            <span class="value">${data.evidence.percentage}%</span>
          </div>
        </div>
      </div>

      <div class="summary-section">
        <h4>Analysis Summary</h4>
        <p class="summary-text">${escapeHtml(data.explanation)}</p>
        <button class="expand-btn" onclick="toggleDetails(this)">+ View Research Papers</button>
        <div class="details-section" style="display:none">
          <div class="papers-section">
            <h4>Supporting Research (${data.papers.length} paper${data.papers.length !== 1 ? 's' : ''})</h4>
            <div class="papers-list">${papersHtml}</div>
          </div>
        </div>
      </div>

      <p style="font-size:11px;color:var(--text-faint);line-height:1.6;padding-top:12px;border-top:1px solid var(--border);margin-top:4px">
        <strong>Disclaimer:</strong> This analysis is for informational purposes only and does not replace professional medical advice.
        Always consult a registered dietitian or healthcare provider for personalised nutrition guidance.
      </p>

    </div>`;

  resultContainer.innerHTML = html;
  setTimeout(() => drawEvidenceGauge(data.evidence.percentage, data.evidence.breakdown), 100);
}

function toggleDetails(btn) {
  const detailsSection = btn.nextElementSibling;
  const isVisible = detailsSection.style.display !== 'none';
  detailsSection.style.display = isVisible ? 'none' : 'block';
  btn.textContent = isVisible ? '+ View Detailed Analysis' : '- Hide Details';
}

function addToHistory(data) {
  const historyItem = {
    id: Date.now(),
    claim: data.claim,
    verdict: data.verdict,
    topic: data.topic,
    timestamp: new Date().toLocaleString()
  };

  analysisHistory.unshift(historyItem);
  if (analysisHistory.length > 20) analysisHistory.pop();

  saveHistory();
  updateHistoryDisplay();
}

function updateHistoryDisplay() {
  const historyList = document.getElementById('historyList');

  if (analysisHistory.length === 0) {
    historyList.innerHTML = '<p class="empty-state">No analyses yet</p>';
    return;
  }

  historyList.innerHTML = analysisHistory.map(item => `
    <div class="history-item" onclick="loadFromHistory('${item.claim}')">
      <span class="verdict-badge ${item.verdict.toLowerCase()}">${item.verdict}</span>
      <div style="font-size: 12px; margin-top: 4px;">${escapeHtml(item.claim.substring(0, 50))}...</div>
      <div style="font-size: 10px; color: #95a5a6; margin-top: 4px;">${item.timestamp}</div>
    </div>
  `).join('');
}

function loadFromHistory(claim) {
  document.getElementById('claimInput').value = claim;
  document.getElementById('charCount').textContent = claim.length;
  analyzeClaim();
}

function loadExample(claim) {
  document.getElementById('claimInput').value = claim;
  document.getElementById('charCount').textContent = claim.length;
  analyzeClaim();
}

function saveHistory() {
  localStorage.setItem('nutricheck_history', JSON.stringify(analysisHistory));
}

function loadHistory() {
  const saved = localStorage.getItem('nutricheck_history');
  if (saved) {
    analysisHistory = JSON.parse(saved);
    updateHistoryDisplay();
  }
}

function clearHistory() {
  if (confirm('Clear all analysis history?')) {
    analysisHistory = [];
    saveHistory();
    updateHistoryDisplay();
  }
}

function showLoadingModal() {
  document.getElementById('loadingModal').classList.remove('hidden');
}

function hideLoadingModal() {
  document.getElementById('loadingModal').classList.add('hidden');
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
