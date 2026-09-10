/**
 * Concise.ai — Contact & Inquiry Form Controller
 * Input validation, service pill selectors, and simulated webhook dispatch.
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
});

function initContactForm() {
  const form = document.getElementById('conciseContactForm');
  if (!form) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const companyInput = document.getElementById('contactCompany');
  const messageInput = document.getElementById('contactMessage');
  const submitBtn = form.querySelector('button[type="submit"]');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const clearErrors = () => {
    form.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('has-error');
    });
  };

  // Clear error on input
  [nameInput, emailInput, companyInput, messageInput].forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group) group.classList.remove('has-error');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    let hasErrors = false;

    if (!nameInput.value.trim()) {
      nameInput.closest('.form-group').classList.add('has-error');
      hasErrors = true;
    }

    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      emailInput.closest('.form-group').classList.add('has-error');
      hasErrors = true;
    }

    if (!messageInput.value.trim()) {
      messageInput.closest('.form-group').classList.add('has-error');
      hasErrors = true;
    }

    if (hasErrors) {
      if (window.showToast) {
        window.showToast('Please check the required fields highlighted in red.', 'error');
      }
      return;
    }

    // Collect Selected Services & Build Payload
    const selectedServices = Array.from(form.querySelectorAll('.service-pill-checkbox:checked'))
      .map(cb => cb.value);

    const inquiryId = 'REQ-' + Math.random().toString(36).substr(2, 7).toUpperCase();
    const payload = {
      id: inquiryId,
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      company: companyInput.value.trim() || 'Not specified',
      services: selectedServices.length > 0 ? selectedServices : ['Custom AI Strategy'],
      message: messageInput.value.trim(),
      created_at: new Date().toISOString()
    };

    // Submission State
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Transmitting to AI Architecture Team...';
    submitBtn.disabled = true;

    // Persist to LocalStorage
    try {
      const existing = JSON.parse(localStorage.getItem('concise_inquiries') || '[]');
      existing.unshift(payload);
      localStorage.setItem('concise_inquiries', JSON.stringify(existing));
    } catch (e) {
      console.warn('LocalStorage unavailable for inquiries', e);
    }

    // Optional Production Webhook Integration
    if (window.CONCISE_WEBHOOK_URL) {
      fetch(window.CONCISE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.error('Webhook dispatch error:', err));
    }

    setTimeout(() => {
      submitBtn.innerHTML = '✓ Inquiry Dispatched';
      submitBtn.classList.add('btn-glow');

      // Show success modal or toast
      const successModal = document.getElementById('contactSuccessModal');
      if (successModal) {
        const detailEl = successModal.querySelector('.success-inquiry-detail');
        if (detailEl) {
          detailEl.innerHTML = `
            <div style="margin-bottom: 8px; font-size: 0.75rem; color: var(--brand-green); font-family: var(--font-mono);">REF ID: ${inquiryId}</div>
            <strong>Name:</strong> ${payload.name}<br>
            <strong>Email:</strong> ${payload.email}<br>
            <strong>Company:</strong> ${payload.company}<br>
            <strong>Focus:</strong> ${payload.services.join(', ')}
          `;
        }
        successModal.classList.add('open');
      } else if (window.showToast) {
        window.showToast(`Thank you! Briefing [${inquiryId}] dispatched. An engineer will reach out within 4 business hours.`, 'success');
      }

      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-glow');
      }, 3000);

    }, 1000);
  });
}

function initContactSlots() {
  const slotGrid = document.getElementById('contactSlotGrid');
  const bSlotInput = document.getElementById('bSlot');
  if (!slotGrid) return;

  const slotBtns = slotGrid.querySelectorAll('.calendar-slot-btn');
  slotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      slotBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const selectedText = btn.textContent.trim();
      if (bSlotInput) {
        bSlotInput.value = selectedText;
      }
    });
  });

  // Also sync on clicking confirmSlotBtn or opening booking
  const confirmBtn = document.getElementById('confirmSlotBtn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      const activeBtn = slotGrid.querySelector('.calendar-slot-btn.selected');
      if (activeBtn && bSlotInput) {
        bSlotInput.value = activeBtn.textContent.trim();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initContactSlots();
});

