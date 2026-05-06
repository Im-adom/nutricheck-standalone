function drawEvidenceGauge(percentage, breakdown) {
  const container = document.getElementById('gaugeChart');
  if (!container) return;

  container.innerHTML = ''; // Clear previous

  const width = Math.min(container.clientWidth || 300, 300);
  const height = width * 0.6;

  const svg = d3.select('#gaugeChart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const g = svg.append('g')
    .attr('transform', `translate(${width / 2},${height * 0.8})`);

  // Gauge background (arc)
  const arcBackground = d3.arc()
    .innerRadius(60)
    .outerRadius(80)
    .startAngle(-Math.PI)
    .endAngle(0);

  g.append('path')
    .attr('d', arcBackground)
    .attr('fill', '#ecf0f1');

  // Gauge colored sections
  const sections = [
    { name: 'Weak', color: '#e74c3c', range: [0, 33] },
    { name: 'Moderate', color: '#f39c12', range: [33, 66] },
    { name: 'Strong', color: '#27ae60', range: [66, 100] }
  ];

  sections.forEach(section => {
    const [startPercent, endPercent] = section.range;
    const arcSection = d3.arc()
      .innerRadius(60)
      .outerRadius(80)
      .startAngle((-Math.PI * (100 - endPercent)) / 100)
      .endAngle((-Math.PI * (100 - startPercent)) / 100);

    g.append('path')
      .attr('d', arcSection)
      .attr('fill', section.color)
      .attr('opacity', 0.7);
  });

  // Needle
  const needleAngle = (-Math.PI * (100 - percentage)) / 100;
  const needleLength = 70;

  g.append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', needleLength * Math.cos(needleAngle))
    .attr('y2', needleLength * Math.sin(needleAngle))
    .attr('stroke', '#2c3e50')
    .attr('stroke-width', 3)
    .attr('stroke-linecap', 'round');

  // Needle circle
  g.append('circle')
    .attr('r', 6)
    .attr('fill', '#2c3e50');

  // Percentage text
  g.append('text')
    .attr('x', 0)
    .attr('y', -40)
    .attr('text-anchor', 'middle')
    .attr('font-size', '28px')
    .attr('font-weight', 'bold')
    .attr('fill', '#2c3e50')
    .text(`${percentage}%`);

  // Labels
  const labels = [
    { angle: -Math.PI, label: 'Weak', x: -90 },
    { angle: -Math.PI / 2, label: 'Moderate', x: 0 },
    { angle: 0, label: 'Strong', x: 90 }
  ];

  labels.forEach(label => {
    g.append('text')
      .attr('x', label.x)
      .attr('y', 100)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', '#7f8c8d')
      .text(label.label);
  });

  // Breakdown stats
  const statsContainer = document.createElement('div');
  statsContainer.style.marginTop = '16px';
  statsContainer.style.display = 'grid';
  statsContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
  statsContainer.style.gap = '8px';
  statsContainer.style.fontSize = '12px';

  const stats = [
    { label: 'Systematic Reviews', value: breakdown.systematicReviews, icon: '🔬' },
    { label: 'RCTs', value: breakdown.rcts, icon: '🧪' },
    { label: 'Clinical Trials', value: breakdown.clinicalTrials, icon: '🏥' },
    { label: 'Other Studies', value: breakdown.reviews + breakdown.observational, icon: '📊' }
  ];

  stats.forEach(stat => {
    const div = document.createElement('div');
    div.style.background = '#f8f9fa';
    div.style.padding = '8px';
    div.style.borderRadius = '4px';
    div.innerHTML = `<span style="font-weight: 600;">${stat.icon} ${stat.value}</span><div style="font-size: 10px; color: #7f8c8d;">${stat.label}</div>`;
    statsContainer.appendChild(div);
  });

  container.appendChild(statsContainer);
}
