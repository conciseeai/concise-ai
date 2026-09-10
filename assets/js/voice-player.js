/**
 * Concise.ai - Interactive Voice Receptionist Audio Sandbox
 * Multi-scenario telephony audio player with live waveform dance and speech synthesis.
 */

document.addEventListener("DOMContentLoaded", () => {
  initVoicePlayer();
});

const VOICE_SCENARIOS = {
  dental: {
    title: "Healthcare Clinic Intake",
    tag: "Sub-380ms Latency",
    caller: "Caller: 'Hi, I chipped a molar having lunch. Do you have any emergency appointments open this afternoon?'",
    ai: "AI Receptionist: 'I can help with that right away! Dr. Miller has an emergency slot open at 3:15 PM today at our downtown clinic. Would you like me to reserve your name for that window?'",
    duration: "0:14"
  },
  saas: {
    title: "Enterprise B2B Triage",
    tag: "VPC / Zero Retention",
    caller: "Caller: 'Hi, our engineering lead wants to know if your multi-agent architecture supports private VPC deployments.'",
    ai: "AI Receptionist: 'Yes, absolutely. All Concise.ai agent systems can be containerized and deployed within your private AWS or GCP VPC with zero data retention. Can I set up a technical architecture review with our lead engineer?'",
    duration: "0:18"
  },
  hvac: {
    title: "Emergency Field Services",
    tag: "24/7 First-Ring Response",
    caller: "Caller: 'Our commercial walk-in cooler just failed at our restaurant. We need immediate technician dispatch.'",
    ai: "AI Receptionist: 'Emergency recorded. Our on-call commercial refrigeration technician, Dave, has been alerted and will arrive at your address in approximately 35 minutes. Dispatch ticket #914 is confirmed.'",
    duration: "0:16"
  }
};

function initVoicePlayer() {
  const consoleEl = document.querySelector(".voice-player-console");
  if (!consoleEl) return;

  const playBtn = consoleEl.querySelector(".voice-play-trigger");
  const tabs = consoleEl.querySelectorAll(".voice-tab-btn");
  const callerEl = consoleEl.querySelector(".voice-line-caller");
  const aiEl = consoleEl.querySelector(".voice-line-ai");
  const statusEl = consoleEl.querySelector(".voice-telemetry-status");
  let currentKey = "dental";
  let isPlaying = false;
  let playTimeout = null;

  const updateScenario = (key) => {
    currentKey = key;
    const data = VOICE_SCENARIOS[key];
    if (!data) return;

    if (callerEl) callerEl.textContent = data.caller;
    if (aiEl) aiEl.textContent = data.ai;
    if (statusEl) statusEl.textContent = "LATENCY: 380ms | SCENARIO: " + data.title.toUpperCase() + " | TWILIO SIP: CONNECTED";
    
    stopAudio();
  };

  const stopAudio = () => {
    isPlaying = false;
    consoleEl.classList.remove("playing");
    if (playBtn) {
      playBtn.innerHTML = "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><polygon points=\"5 3 19 12 5 21 5 3\"/></svg> Play Live Call Sample";
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (playTimeout) clearTimeout(playTimeout);
  };

  const playAudio = () => {
    const data = VOICE_SCENARIOS[currentKey];
    if (!data) return;

    isPlaying = true;
    consoleEl.classList.add("playing");
    if (playBtn) {
      playBtn.innerHTML = "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><rect x=\"6\" y=\"4\" width=\"4\" height=\"16\"/><rect x=\"14\" y=\"4\" width=\"4\" height=\"16\"/></svg> Pause Sample";
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(data.ai.replace("AI Receptionist: ", ""));
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      
      utterance.onend = () => { stopAudio(); };
      utterance.onerror = () => { stopAudio(); };
      window.speechSynthesis.speak(utterance);
    } else {
      playTimeout = setTimeout(() => { stopAudio(); }, 6000);
    }
  };

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      if (isPlaying) { stopAudio(); } else { playAudio(); }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const key = tab.getAttribute("data-scenario");
      updateScenario(key);
    });
  });

  updateScenario("dental");
}
