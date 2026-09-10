/**
 * Concise.ai — Featured Solution: AI Workforce & Workflow Simulator
 * Interactive agent persona explorer & animated end-to-end workflow pipeline.
 */

document.addEventListener('DOMContentLoaded', () => {
  initWorkforceSelector();
  initWorkflowSimulator();
});

const AGENT_PERSONAS = {
  receptionist: {
    title: "AI Receptionist",
    badge: "Voice & Phone Telephony",
    description: "Operates 24/7 on your primary phone numbers, answering calls in under 500ms with ultra-natural human tone, triaging emergency calls, and scheduling appointments directly to staff calendars.",
    tools: ["Twilio / SIP Voice Trunk", "Google / Outlook Calendar", "Live Audio Whisper", "Voicemail Transcription"],
    logUser: "Caller: 'Hi, I need to schedule a consult for enterprise ERP migration tomorrow.'",
    logAi: "AI Receptionist: 'Certainly! I have 11:00 AM or 3:30 PM EST available with our solutions architect. Which works best for you?'"
  },
  sales: {
    title: "AI Sales Assistant",
    badge: "Inbound Conversion",
    description: "Acts as your tireless frontline SDR. Engages website visitors and WhatsApp inquiries within 10 seconds, answers complex product pricing questions, and collects discovery context.",
    tools: ["WhatsApp Business API", "Stripe Checkout", "Pricing Vector Database", "Clearbit / Apollo Enrichment"],
    logUser: "Prospect: 'What is the implementation timeline for 4 custom agents?'",
    logAi: "AI Sales: 'Typical deployment is 14 business days. For multi-agent sync, we include a staging sprint. What CRM do you currently run?'"
  },
  support: {
    title: "AI Customer Support",
    badge: "Tier-1 & Tier-2 Resolution",
    description: "Resolves up to 78% of repetitive customer support inquiries instantly by retrieving knowledge base articles, checking order states, and generating verified technical answers.",
    tools: ["Zendesk / Intercom", "Postgres Order Database", "Semantic Vector Search", "Slack Escalations"],
    logUser: "Customer: 'My webhook payload failed on event invoice.paid, error 422.'",
    logAi: "AI Support: 'Checking telemetry: Your schema requires line_items array format. Here is the corrected cURL payload structure to test.'"
  },
  qualifier: {
    title: "AI Lead Qualifier",
    badge: "BANT Scoring Engine",
    description: "Applies real-time qualification frameworks (Budget, Authority, Need, Timeline) to every inbound lead across forms, emails, and chats before booking human reps.",
    tools: ["HubSpot Scoring", "Salesforce API", "Company Registry Check", "Custom Logic Trees"],
    logUser: "Lead Form: 'Looking to automate invoice dispatch for 1,200 monthly vendors.'",
    logAi: "AI Qualifier: 'High-intent enterprise lead detected (Score: 94/100). Enriched with ARR & tech-stack. Routing to Account Exec.'"
  },
  setter: {
    title: "AI Appointment Setter",
    badge: "Multi-Zone Scheduling",
    description: "Handles timezone coordination, rescheduling, reminder SMS dispatches, and pre-meeting questionnaires so your team never suffers from no-shows.",
    tools: ["Cal.com / Calendly", "Twilio SMS Gateway", "Zoom / Google Meet APIs", "Timezone Engine"],
    logUser: "Executive: 'Need to push our Friday strategy session by 2 hours.'",
    logAi: "AI Setter: 'No problem. I checked both calendars and shifted the session to Friday 4:00 PM EST. Calendar updates dispatched.'"
  },
  operations: {
    title: "AI Operations Assistant",
    badge: "Internal Workflow Worker",
    description: "Synchronizes data across legacy internal portals, processes incoming PDF invoices, checks compliance signatures, and updates weekly management dashboards.",
    tools: ["OCR Document Parser", "Supabase / AWS S3", "Internal Webhooks", "Automated Slack Digests"],
    logUser: "System Trigger: 'Vendor contract batch #892 uploaded to secure drive.'",
    logAi: "AI Ops: '14 documents parsed and verified. Compliance audit passed. Synced with billing ledger; zero discrepancies found.'"
  }
};

function initWorkforceSelector() {
  const buttons = document.querySelectorAll('.workforce-btn');
  const panel = document.getElementById('agentDetailPanel');
  if (!buttons.length || !panel) return;

  const titleEl = panel.querySelector('.agent-panel-title');
  const badgeEl = panel.querySelector('.agent-panel-badge');
  const descEl = panel.querySelector('.agent-panel-desc');
  const toolsEl = panel.querySelector('.agent-panel-tools');
  const terminalUser = panel.querySelector('.terminal-user');
  const terminalAi = panel.querySelector('.terminal-ai');

  const updatePanel = (key) => {
    const data = AGENT_PERSONAS[key];
    if (!data) return;

    if (titleEl) titleEl.textContent = data.title;
    if (badgeEl) badgeEl.textContent = data.badge;
    if (descEl) descEl.textContent = data.description;
    
    if (toolsEl) {
      toolsEl.innerHTML = data.tools.map(tool => `
        <li class="agent-spec-item">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <span>${tool}</span>
        </li>
      `).join('');
    }

    if (terminalUser) terminalUser.textContent = data.logUser;
    if (terminalAi) terminalAi.textContent = data.logAi;
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-agent');
      updatePanel(key);
    });
  });

  // Default initial persona
  updatePanel('receptionist');
}

/* --------------------------------------------------------------------------
   Workflow Pipeline Simulator
   Customer → AI Agent → Qualification → CRM → Follow-up → Human Team
   -------------------------------------------------------------------------- */
const WORKFLOW_STEPS = [
  { index: 0, title: "Customer Inbound", desc: "Inquiry received via WhatsApp/Voice/Web" },
  { index: 1, title: "AI Agent Triage", desc: "Instant intent parsing & semantic classification" },
  { index: 2, title: "Qualification Engine", desc: "BANT criteria checked & enriched with company metrics" },
  { index: 3, title: "CRM Sync", desc: "Contact record created & assigned in CRM in 200ms" },
  { index: 4, title: "Automated Follow-up", desc: "Calendar invite, SMS recap & custom deck dispatched" },
  { index: 5, title: "Human Team", desc: "Deal handed off with executive briefing ready to close" }
];

function initWorkflowSimulator() {
  const simBtn = document.getElementById('runWorkflowSimBtn');
  const stepNodes = document.querySelectorAll('.pipeline-step-node');
  const logText = document.getElementById('workflowLogText');

  if (!simBtn || !stepNodes.length) return;

  let isSimulating = false;

  const runSimulation = () => {
    if (isSimulating) return;
    isSimulating = true;
    simBtn.disabled = true;
    simBtn.innerHTML = 'Running Pipeline Simulation...';

    // Reset nodes
    stepNodes.forEach(n => {
      n.classList.remove('active', 'completed');
    });

    let currentStep = 0;

    const stepInterval = setInterval(() => {
      if (currentStep > 0) {
        stepNodes[currentStep - 1].classList.remove('active');
        stepNodes[currentStep - 1].classList.add('completed');
      }

      if (currentStep < WORKFLOW_STEPS.length) {
        stepNodes[currentStep].classList.add('active');
        const stepData = WORKFLOW_STEPS[currentStep];
        if (logText) {
          logText.innerHTML = `<strong>Step 0${currentStep + 1} (${stepData.title}):</strong> ${stepData.desc}`;
        }
        currentStep++;
      } else {
        clearInterval(stepInterval);
        isSimulating = false;
        simBtn.disabled = false;
        simBtn.innerHTML = 'Run Workflow Simulation';
        if (logText) {
          logText.innerHTML = `<span style="color: var(--brand-green-light); font-weight: 600;">Full pipeline executed autonomously in 1.42s with zero latency.</span>`;
        }
        if (window.showToast) {
          window.showToast('Simulated event completed: End-to-end autonomous triage executed.', 'success');
        }
      }
    }, 900);
  };

  simBtn.addEventListener('click', runSimulation);
}
