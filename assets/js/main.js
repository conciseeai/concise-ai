/**
 * Concise.ai — Core Application Logic
 * Navigation, mobile drawer, booking modal, accordions, and utilities.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initBookingModal();
  initAccordions();
  highlightActiveNav();
  initCardSpotlight();
  initMobileStickyBar();
});

/* --------------------------------------------------------------------------
   1. Header Scroll Blur
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. Mobile Drawer Navigation
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const closeBtn = document.querySelector('.mobile-close-btn');
  const backdrop = document.querySelector('.drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* --------------------------------------------------------------------------
   3. Global Booking Modal Experience
   -------------------------------------------------------------------------- */
function initBookingModal() {
  const openButtons = document.querySelectorAll('[data-open-booking]');
  const modal = document.getElementById('bookingModal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close-btn');
  const dateSlots = modal.querySelectorAll('.calendar-slot-btn');
  const bookingForm = modal.querySelector('#quickBookingForm');

  const openModal = (e) => {
    if (e) e.preventDefault();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  openButtons.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Keyboard ESC support for modal & mobile drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal.classList.contains('open')) closeModal();
      const drawer = document.querySelector('.mobile-drawer');
      const backdrop = document.querySelector('.drawer-backdrop');
      if (drawer && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        if (backdrop) backdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  // Slot Selection
  dateSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      dateSlots.forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
    });
  });

  // Handle Quick Booking Submit with LocalStorage Persistence
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = bookingForm.querySelector('input[name="name"]')?.value || bookingForm.querySelector('#bName')?.value || '';
      const email = bookingForm.querySelector('input[name="email"]')?.value || bookingForm.querySelector('#bEmail')?.value || '';
      const selectedSlot = bookingForm.querySelector('#bSlot')?.value || 
        modal.querySelector('.calendar-slot-btn.selected')?.textContent?.trim() || 
        document.querySelector('.calendar-slot-btn.selected')?.textContent?.trim() || 
        'Next Available Session';

      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Securing Session...';
      submitBtn.disabled = true;

      // Persist to localStorage for reliability
      try {
        const bookings = JSON.parse(localStorage.getItem('concise_bookings') || '[]');
        bookings.push({
          id: 'CAL-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
          name,
          email,
          slot: selectedSlot,
          created_at: new Date().toISOString()
        });
        localStorage.setItem('concise_bookings', JSON.stringify(bookings));
      } catch (err) {
        console.warn('LocalStorage unavailable for bookings', err);
      }

      setTimeout(() => {
        submitBtn.innerHTML = '✓ Strategy Session Reserved';
        showToast('Strategy session requested! Our executive AI architect will confirm within 2 hours.', 'success');
        setTimeout(() => {
          closeModal();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          bookingForm.reset();
        }, 1800);
      }, 900);
    });
  }
}

/* --------------------------------------------------------------------------
   4. Accordions (FAQ & Deep Dives)
   -------------------------------------------------------------------------- */
function initAccordions() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other open items
      accordionItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });

      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Active Nav Highlighting
   -------------------------------------------------------------------------- */
function highlightActiveNav() {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const cleanHref = href.replace(/\/$/, '') || '/';
    
    if (cleanHref === currentPath || (currentPath !== '/' && cleanHref !== '/' && currentPath.endsWith(cleanHref))) {
      link.classList.add('active');
    }
  });
}

/* --------------------------------------------------------------------------
   6. Global Toast Notifications (Pure SVG Icons, Zero Emojis)
   -------------------------------------------------------------------------- */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const iconSvg = type === 'success'
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00e676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

  toast.innerHTML = `
    <span style="display: flex; align-items: center;">${iconSvg}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

window.showToast = showToast;

/* --------------------------------------------------------------------------
   7. Card Cursor Spotlight (Linear / Vercel glow)
   -------------------------------------------------------------------------- */
function initCardSpotlight() {
  const cards = document.querySelectorAll('.card-premium, .case-card, .integration-card');
  cards.forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* --------------------------------------------------------------------------
   8. Mobile Sticky Conversion Bar
   -------------------------------------------------------------------------- */
function initMobileStickyBar() {
  if (window.innerWidth > 640) return;

  let bar = document.querySelector('.mobile-sticky-cta-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'mobile-sticky-cta-bar';
    bar.innerHTML = `
      <div>
        <div style="font-size: 0.75rem; font-weight: 700; color: #fff;">Concise.ai</div>
        <div style="font-size: 0.6875rem; color: var(--text-muted);">Autonomous AI Solutions</div>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="btn btn-primary btn-sm" data-open-booking style="padding: 8px 12px; font-size: 0.75rem;">
          Book Strategy Call →
        </button>
      </div>
    `;
    document.body.appendChild(bar);

    const bookingBtn = bar.querySelector('[data-open-booking]');
    if (bookingBtn) {
      bookingBtn.addEventListener('click', () => {
        const modal = document.getElementById('bookingModal');
        if (modal) {
          modal.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    }
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 380) {
      bar.classList.add('visible');
    } else {
      bar.classList.remove('visible');
    }
  }, { passive: true });
}
