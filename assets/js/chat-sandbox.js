/**
 * Concise.ai - Interactive Chatbot Sandbox Simulator
 * Real-time conversational triage simulator with prompt chips and typing indicators.
 */

document.addEventListener("DOMContentLoaded", () => {
  initChatSandbox();
});

const KNOWLEDGE_RESPONSES = {
  hubspot: "Yes, absolutely! We configure bi-directional Webhook and REST API synchronization with HubSpot, Salesforce, and Zoho. Every WhatsApp conversation, contact enrichment, and deal stage is updated in real-time.",
  latency: "Our production inference latency averages sub-450ms globally. We use edge-routed vector caching and streaming LLM token generation so visitors never feel robotic pauses.",
  hallucination: "We deploy strict deterministic guardrails and Hybrid RAG. If an inquiry falls outside your verified knowledge base or confidence falls below 96%, the agent executes an automated escalation to human reps.",
  invoice: "Directly integrated! Our agents can invoke Stripe, Razorpay, or custom ERP APIs to generate authenticated payment links and PDF invoices directly within the WhatsApp or web chat thread.",
  default: "Thank you for inquiring! Concise.ai builds bespoke AI agent solutions tailored to your exact business operations. You can book an executive architecture scoping call with our team right now!"
};

function initChatSandbox() {
  const container = document.getElementById("chatSandboxContainer");
  if (!container) return;

  const messagesBox = container.querySelector(".chat-messages-box");
  const inputEl = container.querySelector(".chat-sandbox-input");
  const sendBtn = container.querySelector(".chat-sandbox-send");
  const chips = container.querySelectorAll(".chat-prompt-chip");

  const appendMessage = (text, sender = "user") => {
    const msgDiv = document.createElement("div");
    msgDiv.style.maxWidth = "84%";
    msgDiv.style.padding = "10px 14px";
    msgDiv.style.borderRadius = sender === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px";
    msgDiv.style.fontSize = "0.825rem";
    msgDiv.style.lineHeight = "1.5";

    if (sender === "user") {
      msgDiv.style.alignSelf = "flex-end";
      msgDiv.style.background = "#1e293b";
      msgDiv.style.color = "#ffffff";
      msgDiv.textContent = text;
    } else {
      msgDiv.style.alignSelf = "flex-start";
      msgDiv.style.background = "rgba(0, 200, 83, 0.1)";
      msgDiv.style.border = "1px solid rgba(0, 200, 83, 0.25)";
      msgDiv.style.color = "#f8fafc";
      msgDiv.innerHTML = text;
    }

    messagesBox.appendChild(msgDiv);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  };

  const showTypingAndReply = (userQuery, responseText) => {
    appendMessage(userQuery, "user");

    const typingEl = document.createElement("div");
    typingEl.className = "chat-typing-indicator";
    typingEl.style.alignSelf = "flex-start";
    typingEl.style.fontSize = "0.75rem";
    typingEl.style.color = "var(--brand-green-light)";
    typingEl.style.padding = "6px 12px";
    typingEl.innerHTML = "<span class=\"pulse-dot\" style=\"display:inline-block; vertical-align:middle; margin-right:6px;\"></span> Concise AI is formulating verified response...";
    messagesBox.appendChild(typingEl);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    setTimeout(() => {
      typingEl.remove();
      appendMessage(responseText, "ai");
    }, 650);
  };

  const handleSend = () => {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = "";

    const lower = text.toLowerCase();
    let reply = KNOWLEDGE_RESPONSES.default;
    if (lower.includes("hubspot") || lower.includes("crm") || lower.includes("sync")) {
      reply = KNOWLEDGE_RESPONSES.hubspot;
    } else if (lower.includes("latency") || lower.includes("speed") || lower.includes("fast")) {
      reply = KNOWLEDGE_RESPONSES.latency;
    } else if (lower.includes("hallucin") || lower.includes("accurate") || lower.includes("mistake")) {
      reply = KNOWLEDGE_RESPONSES.hallucination;
    } else if (lower.includes("invoice") || lower.includes("pay") || lower.includes("stripe")) {
      reply = KNOWLEDGE_RESPONSES.invoice;
    }

    showTypingAndReply(text, reply);
  };

  if (sendBtn && inputEl) {
    sendBtn.addEventListener("click", handleSend);
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleSend();
    });
  }

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const q = chip.getAttribute("data-q");
      const key = chip.getAttribute("data-key");
      const reply = KNOWLEDGE_RESPONSES[key] || KNOWLEDGE_RESPONSES.default;
      showTypingAndReply(q, reply);
    });
  });
}
