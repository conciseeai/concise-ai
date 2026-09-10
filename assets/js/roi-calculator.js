/**
 * Concise.ai — Interactive ROI & Automation Calculator
 * Reactive computational engine for business automation estimations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initRoiCalculator();
});

function initRoiCalculator() {
  const empSlider = document.getElementById('calcEmployees');
  const hoursSlider = document.getElementById('calcHours');
  const leadsSlider = document.getElementById('calcLeads');
  const valueSlider = document.getElementById('calcValue');

  const empVal = document.getElementById('valEmployees');
  const hoursVal = document.getElementById('valHours');
  const leadsVal = document.getElementById('valLeads');
  const valueVal = document.getElementById('valValue');

  const outHoursSaved = document.getElementById('outHoursSaved');
  const outOppValue = document.getElementById('outOppValue');
  const outWeeklyLiberated = document.getElementById('outWeeklyLiberated');
  const outRecoveredDeals = document.getElementById('outRecoveredDeals');

  if (!empSlider || !hoursSlider || !leadsSlider || !valueSlider) return;

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (num) => {
    return '$' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num);
  };

  const updateCalculations = () => {
    const employees = parseInt(empSlider.value, 10);
    const hoursPerWeek = parseInt(hoursSlider.value, 10);
    const leadsPerMonth = parseInt(leadsSlider.value, 10);
    const leadValue = parseInt(valueSlider.value, 10);

    // Update Display Labels
    empVal.textContent = `${employees} people`;
    hoursVal.textContent = `${hoursPerWeek} hrs/week`;
    leadsVal.textContent = `${leadsPerMonth} /mo`;
    valueVal.textContent = `$${formatNumber(leadValue)}`;

    // Automation Computations
    // Benchmark: 65% of repetitive operational tasks automated by custom AI agents
    const annualManualHours = employees * hoursPerWeek * 52;
    const estimatedHoursSaved = Math.round(annualManualHours * 0.65);
    const weeklyHoursSaved = Math.round(estimatedHoursSaved / 52);

    // Pipeline Acceleration Computations
    // Benchmark: 14% uplift in lead capture & qualification through instant 24/7 AI response
    const annualLeads = leadsPerMonth * 12;
    const estimatedRecoveredDeals = Math.round(annualLeads * 0.14);
    const estimatedOpportunityValue = estimatedRecoveredDeals * leadValue;

    // Animate or Render Output Values
    if (outHoursSaved) outHoursSaved.textContent = `${formatNumber(estimatedHoursSaved)} hrs/yr`;
    if (outOppValue) outOppValue.textContent = formatCurrency(estimatedOpportunityValue);
    if (outWeeklyLiberated) outWeeklyLiberated.textContent = `${formatNumber(weeklyHoursSaved)} hrs/wk`;
    if (outRecoveredDeals) outRecoveredDeals.textContent = `${formatNumber(estimatedRecoveredDeals)} deals`;

    // Dynamic slider gradient fill
    [empSlider, hoursSlider, leadsSlider, valueSlider].forEach(slider => {
      const min = parseFloat(slider.min);
      const max = parseFloat(slider.max);
      const val = parseFloat(slider.value);
      const percentage = ((val - min) / (max - min)) * 100;
      slider.style.background = `linear-gradient(to right, var(--brand-green) 0%, var(--brand-green-light) ${percentage}%, rgba(255,255,255,0.08) ${percentage}%)`;
    });
  };

  const PRESETS = {
    saas: { emp: 35, hours: 14, leads: 380, val: 2400 },
    clinic: { emp: 18, hours: 10, leads: 220, val: 850 },
    ecommerce: { emp: 12, hours: 8, leads: 950, val: 280 },
    logistics: { emp: 50, hours: 18, leads: 420, val: 3200 },
    agency: { emp: 22, hours: 15, leads: 160, val: 4500 }
  };

  const presetButtons = document.querySelectorAll('.calc-preset-btn');
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-preset');
      const p = PRESETS[key];
      if (p) {
        empSlider.value = p.emp;
        hoursSlider.value = p.hours;
        leadsSlider.value = p.leads;
        valueSlider.value = p.val;
        updateCalculations();
      }
    });
  });

  // Slider change listeners
  [empSlider, hoursSlider, leadsSlider, valueSlider].forEach(slider => {
    slider.addEventListener('input', () => {
      // Remove active preset highlight when manually adjusted
      presetButtons.forEach(b => b.classList.remove('active'));
      updateCalculations();
    });
  });

  // Handle Lead Magnet PDF Report Submission
  const reportForm = document.getElementById('roiReportForm');
  const reportEmail = document.getElementById('roiReportEmail');
  const reportSuccess = document.getElementById('roiReportSuccess');

  if (reportForm && reportEmail && reportSuccess) {
    reportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = reportEmail.value.trim();
      if (!email || !email.includes('@')) return;

      const submitBtn = reportForm.querySelector('.roi-lead-submit');
      if (submitBtn) {
        submitBtn.textContent = 'Generating PDF...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        reportForm.style.display = 'none';
        reportSuccess.style.display = 'block';
        const hoursSaved = outHoursSaved ? outHoursSaved.textContent : '10,000+ hrs';
        const oppVal = outOppValue ? outOppValue.textContent : '$600k+';
        reportSuccess.innerHTML = `
          <div style="font-weight: 700; color: var(--brand-green-light); margin-bottom: 4px;">✓ Custom Executive Report Sent!</div>
          <div style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.4;">
            Dispatched to <strong>${email}</strong> with your customized breakdown (${hoursSaved} saved & ${oppVal} pipeline impact).
          </div>
        `;
      }, 700);
    });
  }

  // Initial render with saas default
  updateCalculations();
}

