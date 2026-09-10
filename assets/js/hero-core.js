/**
 * Concise.ai — Enterprise AI Workflow Console
 * Interactive, high-trust workflow pipeline demonstrating real-time AI execution.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroWorkflowConsole();
});

const CONSOLE_SCENARIOS = {
  voice: {
    badge: "Inbound Voice Receptionist",
    steps: [
      {
        icon: `<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
        title: "Inbound Telephony Call",
        tag: "0.2s · Active",
        desc: "Caller (+1 415-892-0194): 'Looking to deploy an after-hours voice receptionist for 2 clinics.'"
      },
      {
        icon: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
        title: "Concise AI Reasoning Core",
        tag: "380ms Latency",
        desc: "Natural speech synthesis · Intent: Multi-location appointment triage · BANT qualified."
      },
      {
        icon: `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
        title: "System Synchronized",
        tag: "1.2s · Complete",
        desc: "Calendar reserved for Friday 10:00 AM · Full call audio transcript synced to CRM."
      }
    ],
    telemetry: [
      { val: "14.2h", lbl: "Saved / Week", brand: true },
      { val: "< 380ms", lbl: "Speech Latency", brand: false },
      { val: "100%", lbl: "First-Ring Triage", brand: true }
    ]
  },
  whatsapp: {
    badge: "WhatsApp Business AI",
    steps: [
      {
        icon: `<svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
        title: "Inbound WhatsApp Query",
        tag: "0.1s · Active",
        desc: "Customer: 'Can you quote automated dispatch for 45 commercial freight trucks?'"
      },
      {
        icon: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
        title: "Autonomous Pricing Retrieval",
        tag: "Grounded RAG",
        desc: "Queried secure internal fleet rate matrix · Calculated tiered commercial discount."
      },
      {
        icon: `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`,
        title: "Quote & Proposal Dispatched",
        tag: "0.8s · Complete",
        desc: "Custom proposal PDF delivered via WhatsApp · Account executive notified in Slack."
      }
    ],
    telemetry: [
      { val: "99.4%", lbl: "Resolution Rate", brand: true },
      { val: "< 12s", lbl: "Response Time", brand: false },
      { val: "0h", lbl: "Manual Invoicing", brand: true }
    ]
  },
  crm: {
    badge: "Autonomous Lead Funnel",
    steps: [
      {
        icon: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M15 9h6"/></svg>`,
        title: "Inbound Web Lead Webhook",
        tag: "0.05s · Ingested",
        desc: "Enterprise form submission received from healthcare tech provider."
      },
      {
        icon: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
        title: "Multi-Agent Enrichment",
        tag: "Enriched",
        desc: "Firmographic data enriched · 120 headcount, Series B, verified decision maker."
      },
      {
        icon: `<svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
        title: "Bi-Directional Pipeline Sync",
        tag: "1.1s · Complete",
        desc: "HubSpot deal created ($48k ARR) · Personalized discovery briefing generated."
      }
    ],
    telemetry: [
      { val: "3.2x", lbl: "Pipeline Velocity", brand: true },
      { val: "100%", lbl: "Data Fidelity", brand: false },
      { val: "24/7", lbl: "Autonomous Funnel", brand: true }
    ]
  }
};

function initHeroWorkflowConsole() {
  const tabs = document.querySelectorAll('.console-tab-btn');
  const pipelineEl = document.getElementById('consolePipeline');
  const telemetryEl = document.getElementById('consoleTelemetry');
  const cardEl = document.querySelector('.hero-console-card');

  if (!tabs.length || !pipelineEl || !telemetryEl) return;

  let currentKey = 'voice';
  let autoCycleTimer = null;
  let isHovered = false;

  const renderScenario = (key) => {
    const data = CONSOLE_SCENARIOS[key];
    if (!data) return;

    // Render Steps
    pipelineEl.innerHTML = `
      <div class="pipeline-step-card active-step">
        <div class="step-icon-wrap">
          ${data.steps[0].icon}
        </div>
        <div class="step-content">
          <div class="step-header">
            <span class="step-title">${data.steps[0].title}</span>
            <span class="step-tag">${data.steps[0].tag}</span>
          </div>
          <div class="step-desc">${data.steps[0].desc}</div>
        </div>
      </div>

      <div class="pipeline-connector">
        <div class="connector-line"></div>
      </div>

      <div class="pipeline-step-card active-step">
        <div class="step-icon-wrap">
          ${data.steps[1].icon}
        </div>
        <div class="step-content">
          <div class="step-header">
            <span class="step-title">${data.steps[1].title}</span>
            <span class="step-tag">${data.steps[1].tag}</span>
          </div>
          <div class="step-desc">${data.steps[1].desc}</div>
        </div>
      </div>

      <div class="pipeline-connector">
        <div class="connector-line"></div>
      </div>

      <div class="pipeline-step-card active-step">
        <div class="step-icon-wrap">
          ${data.steps[2].icon}
        </div>
        <div class="step-content">
          <div class="step-header">
            <span class="step-title">${data.steps[2].title}</span>
            <span class="step-tag">${data.steps[2].tag}</span>
          </div>
          <div class="step-desc">${data.steps[2].desc}</div>
        </div>
      </div>
    `;

    // Render Telemetry
    telemetryEl.innerHTML = data.telemetry.map(t => `
      <div class="telemetry-mini-pill">
        <div class="telemetry-mini-val ${t.brand ? 'brand' : ''}">${t.val}</div>
        <div class="telemetry-mini-lbl">${t.lbl}</div>
      </div>
    `).join('');
  };

  // Switch tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetKey = tab.getAttribute('data-console-tab');
      if (targetKey === currentKey) return;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentKey = targetKey;
      renderScenario(currentKey);
    });
  });

  // Hover detection to pause auto-cycle
  if (cardEl) {
    cardEl.addEventListener('mouseenter', () => { isHovered = true; });
    cardEl.addEventListener('mouseleave', () => { isHovered = false; });
  }

  // Smooth Auto-cycle every 6 seconds
  const scenarioKeys = ['voice', 'whatsapp', 'crm'];
  autoCycleTimer = setInterval(() => {
    if (isHovered) return;
    const nextIdx = (scenarioKeys.indexOf(currentKey) + 1) % scenarioKeys.length;
    currentKey = scenarioKeys[nextIdx];

    tabs.forEach(t => {
      if (t.getAttribute('data-console-tab') === currentKey) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    renderScenario(currentKey);
  }, 6000);

  // Initial render
  renderScenario('voice');
}
