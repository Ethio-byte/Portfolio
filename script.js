/* ==========================================================================
   Tamirat Dalasa — Personal Portfolio
   Vanilla JavaScript. No frameworks, no libraries.

   1.  SETUP
   2.  MOBILE MENU
   3.  SCROLL: header state + progress bar
   4.  SCROLL REVEAL (fade-up)
   5.  HERO ENTRANCE
   6.  BUTTON POINTER MAGNET
   7.  COLLAPSIBLE "MY CONTRIBUTION"
   8.  LOCAL TIME CLOCK (Dire Dawa)
   9.  CONTACT FORM (validation + mailto / backend hook)
   10. COPY EMAIL BUTTON
   ========================================================================== */

/* ================= 1. SETUP ================= */
const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const header = document.querySelector('[data-header]');
const main = document.querySelector('main');
const footer = document.querySelector('.site-footer');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Where the contact form should send messages.
// Leave empty to use the mailto: fallback (opens the visitor's email app).
// To use a real backend, put your endpoint here or in the form's data-endpoint
// attribute (see index.html — "BACKEND HOOK").
const CONTACT_ENDPOINT = document.querySelector('[data-contact-form]')?.dataset.endpoint || '';

/* ================= 2. MOBILE MENU ================= */
function setMenu(open, { restoreFocus = true } = {}) {
  if (open) header.classList.remove('hidden');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileMenu.setAttribute('aria-hidden', String(!open));
  mobileMenu.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  main.inert = open;
  footer.inert = open;

  if (open) {
    window.setTimeout(() => mobileMenu.querySelector('a')?.focus(), 50);
  } else if (restoreFocus) {
    menuButton.focus();
  }
}

menuButton.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

// Move keyboard focus to the section a menu link points at
const focusDestination = (hash) => {
  if (!hash?.startsWith('#')) return;
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  const focusTarget = target?.querySelector('h1, h2, h3') || target;
  if (!focusTarget) return;
  const hadTabIndex = focusTarget.hasAttribute('tabindex');
  if (!hadTabIndex) focusTarget.setAttribute('tabindex', '-1');
  focusTarget.focus({ preventScroll: true });
  if (!hadTabIndex) {
    focusTarget.addEventListener('blur', () => focusTarget.removeAttribute('tabindex'), { once: true });
  }
};

mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    setMenu(false, { restoreFocus: false });
    requestAnimationFrame(() => focusDestination(link.hash));
  });
});

// Escape closes the menu; Tab is trapped inside it
document.addEventListener('keydown', (event) => {
  const menuIsOpen = menuButton.getAttribute('aria-expanded') === 'true';
  if (event.key === 'Escape' && menuIsOpen) setMenu(false);
  if (event.key === 'Tab' && menuIsOpen) {
    const focusable = [menuButton, ...mobileMenu.querySelectorAll('a')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

// Close the menu when the viewport grows back to desktop width
const desktopQuery = window.matchMedia('(min-width: 901px)');
const handleDesktopChange = (event) => {
  if (event.matches && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false, { restoreFocus: false });
  }
};
if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', handleDesktopChange);
else desktopQuery.addListener(handleDesktopChange);

/* ================= 3. SCROLL: header state + progress bar ================= */
const progress = document.createElement('div');
progress.className = 'scroll-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.append(progress);

let lastScrollY = window.scrollY;
let scrollFramePending = false;
let scrollRange = 1;

const updateScrollRange = () => {
  scrollRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
};

const updateScrollState = () => {
  const current = window.scrollY;
  progress.style.transform = `scaleX(${Math.min(1, current / scrollRange)})`;
  header.classList.toggle('scrolled', current > 16);
  // Hide the header while scrolling down, show it again when scrolling up
  header.classList.toggle(
    'hidden',
    current > lastScrollY && current > 180 && !document.body.classList.contains('menu-open')
  );
  lastScrollY = current;
  scrollFramePending = false;
};

updateScrollRange();
window.addEventListener('resize', updateScrollRange, { passive: true });
if ('ResizeObserver' in window) new ResizeObserver(updateScrollRange).observe(document.body);

window.addEventListener(
  'scroll',
  () => {
    if (scrollFramePending) return;
    scrollFramePending = true;
    requestAnimationFrame(updateScrollState);
  },
  { passive: true }
);
window.addEventListener('load', () => requestAnimationFrame(updateScrollState), { once: true });
window.addEventListener('hashchange', () => requestAnimationFrame(updateScrollState));

/* ================= 4. SCROLL REVEAL (fade-up) ================= */
// Stagger children of grouped lists so they arrive one after another
document
  .querySelectorAll('.timeline, .skill-grid, .blog-grid, .connect-grid, .project-list, .tools-grid')
  .forEach((group) => {
    Array.from(group.children).forEach((element, index) => {
      if (element.classList.contains('reveal')) {
        element.style.setProperty('--delay', `${Math.min(index * 45, 270)}ms`);
      }
    });
  });

const reveals = document.querySelectorAll('.reveal');

if (reduceMotion || !('IntersectionObserver' in window)) {
  reveals.forEach((element) => element.classList.add('in-view'));
} else {
  // Reveal anything already on screen immediately
  reveals.forEach((element) => {
    const bounds = element.getBoundingClientRect();
    if (bounds.top < window.innerHeight * 0.94 && bounds.bottom > 0) {
      element.classList.add('in-view');
    }
  });

  document.documentElement.classList.add('motion-ready', 'hero-ready');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );

  reveals.forEach((element) => {
    if (!element.classList.contains('in-view')) revealObserver.observe(element);
  });
}

/* ================= 5. BUTTON POINTER MAGNET ================= */
if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.button').forEach((button) => {
    let bounds;
    let frame = 0;

    button.addEventListener('pointerenter', () => {
      bounds = button.getBoundingClientRect();
    });
    button.addEventListener('pointermove', (event) => {
      if (frame || !bounds) return;
      const x = event.clientX;
      const y = event.clientY;
      frame = requestAnimationFrame(() => {
        button.style.setProperty('--mx', `${(x - bounds.left - bounds.width / 2) * 0.16}px`);
        button.style.setProperty('--my', `${(y - bounds.top - bounds.height / 2) * 0.22}px`);
        frame = 0;
      });
    });
    button.addEventListener('pointerleave', () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      bounds = undefined;
      button.style.setProperty('--mx', '0px');
      button.style.setProperty('--my', '0px');
    });
  });
}

/* ================= 6. COLLAPSIBLE "MY CONTRIBUTION" ================= */
// Animates the height of <details> so it opens/closes smoothly.
// The plain <details> behaviour still works if this never runs.
const disclosureMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('.project-details').forEach((details) => {
  const summary = details.querySelector('summary');
  let animation;
  let expanded = details.open;

  const settle = () => {
    if (animation) {
      animation.onfinish = null;
      animation.cancel();
      animation = null;
    }
    details.open = expanded;
    details.classList.remove('is-animating', 'is-closing');
    summary.removeAttribute('aria-expanded');
  };

  summary.addEventListener('click', (event) => {
    if (!details.animate || disclosureMotion.matches) return;
    event.preventDefault();

    const startHeight = details.getBoundingClientRect().height;
    expanded = animation ? !expanded : !details.open;
    if (animation) {
      animation.onfinish = null;
      animation.cancel();
    }

    details.open = expanded;
    const endHeight = details.getBoundingClientRect().height;
    details.open = true;
    details.classList.add('is-animating');
    details.classList.toggle('is-closing', !expanded);
    summary.setAttribute('aria-expanded', String(expanded));

    animation = details.animate(
      [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
      { duration: expanded ? 320 : 240, easing: 'cubic-bezier(0.25, 1, 0.5, 1)', fill: 'both' }
    );
    animation.onfinish = settle;
  });

  window.addEventListener('resize', () => { if (animation) settle(); }, { passive: true });
  disclosureMotion.addEventListener('change', () => { if (animation) settle(); });
});

/* ================= 7. LOCAL TIME CLOCK (Dire Dawa) =================
   Timezone: Africa/Addis_Ababa — updates once a minute. */
const localTime = document.querySelector('[data-local-time]');
if (localTime) {
  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Addis_Ababa',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const updateLocalTime = () => {
      const now = new Date();
      localTime.textContent = `EAT ${formatter.format(now)}`;
      localTime.dateTime = now.toISOString();
    };
    updateLocalTime();
    window.setInterval(updateLocalTime, 60000);
  } catch {
    localTime.textContent = 'EAT';
  }
}

/* ================= 8. CONTACT FORM ================= */
const contactForm = document.querySelector('[data-contact-form]');
if (contactForm) {
  const fields = [...contactForm.querySelectorAll('input, textarea')];
  const submitButton = contactForm.querySelector('[data-submit-button]');
  const submitLabel = contactForm.querySelector('[data-submit-label]');
  const formStatus = contactForm.querySelector('[data-form-status]');
  let formOpening = false;
  let formResetTimer;

  contactForm.noValidate = true;

  const fieldMessage = (field) => {
    const value = field.value.trim();
    if (!value) return field.name === 'message' ? 'Add a short project description.' : `Enter your ${field.name}.`;
    if (field.name === 'email' && field.validity.typeMismatch) return 'Enter a complete email address, such as you@example.com.';
    if (field.name === 'message' && value.length < 10) return 'Please add at least 10 characters.';
    if (field.validity.tooLong) return `Keep this under ${field.maxLength} characters.`;
    return '';
  };

  const validateField = (field) => {
    const message = fieldMessage(field);
    const error = contactForm.querySelector(`[data-field-error="${field.name}"]`);
    field.setAttribute('aria-invalid', String(Boolean(message)));
    if (error) error.textContent = message;
    return !message;
  };

  fields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
      if (formStatus.textContent) formStatus.textContent = '';
    });
  });

  const resetFormAction = () => {
    window.clearTimeout(formResetTimer);
    formOpening = false;
    submitButton.disabled = false;
    submitLabel.textContent = 'Get in Touch';
  };

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (formOpening) return;

    const invalidFields = fields.filter((field) => !validateField(field));
    if (invalidFields.length) {
      formStatus.textContent = 'Please check the highlighted field.';
      invalidFields[0].focus();
      return;
    }

    const data = new FormData(contactForm);
    const name = String(data.get('name')).trim();
    const email = String(data.get('email')).trim();
    const message = String(data.get('message')).trim();
    const subjectText = `Portfolio enquiry from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;

    formOpening = true;
    submitButton.disabled = true;
    submitLabel.textContent = 'Opening email app...';

    /* ==========================================================
       BACKEND HOOK — the form has 2 modes:

       1. CURRENT (no backend): builds a prefilled mailto: link
          to tamratdalasa@gmail.com so the message opens in the visitor's
          email app. Nothing is sent to a server.

       2. FUTURE (with backend): add data-endpoint="https://..."
          to the <form> in index.html, then replace the block
          below with:

            await fetch(CONTACT_ENDPOINT, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
              body: JSON.stringify({ name, email, message }),
            });
            formStatus.textContent = 'Thanks! Your message has been sent.';

          (Formspree, EmailJS, or your own API all work this way.)
       ========================================================== */
    if (CONTACT_ENDPOINT) {
      fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
        .then((response) => {
          if (!response.ok) throw new Error('Request failed');
          contactForm.reset();
          formStatus.textContent = 'Thanks! Your message has been sent.';
        })
        .catch(() => {
          formStatus.textContent = 'Something went wrong. Please email me directly instead.';
        })
        .finally(() => resetFormAction());
      return;
    }

    formStatus.textContent = 'Preparing your ready-to-send message.';
    requestAnimationFrame(() => {
      window.location.href = `mailto:tamratdalasa@gmail.com?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(body)}`;
    });
    formResetTimer = window.setTimeout(() => {
      resetFormAction();
      formStatus.textContent = 'If no email app opened, copy the address above and email me directly.';
    }, 1800);
  });

  window.addEventListener('pageshow', resetFormAction);
}

/* ================= 9. COPY EMAIL BUTTON ================= */
const copyText = async (value) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const helper = document.createElement('textarea');
  helper.value = value;
  helper.setAttribute('readonly', '');
  helper.style.cssText = 'position:fixed;left:-9999px;opacity:0;pointer-events:none';
  document.body.appendChild(helper);
  helper.select();
  const copied = document.execCommand('copy');
  helper.remove();
  if (!copied) throw new Error('Copy unavailable');
};

document.querySelectorAll('[data-copy-contact]').forEach((copyButton) => {
  const copyLabel = copyButton.querySelector('[data-copy-label]');
  const copyIcon = copyButton.querySelector('[data-copy-icon]');
  const copyStatus = document.getElementById(copyButton.dataset.copyStatusId);
  const defaultLabel = copyLabel.textContent;
  let resetCopyState;
  let copying = false;

  copyButton.addEventListener('click', async () => {
    if (copying) return;
    copying = true;
    copyButton.setAttribute('aria-busy', 'true');
    window.clearTimeout(resetCopyState);
    try {
      await copyText(copyButton.dataset.copyValue);
      copyButton.focus({ preventScroll: true });
      copyButton.classList.add('is-copied');
      copyLabel.textContent = 'Copied';
      copyIcon.textContent = '\u2713';
      if (copyStatus) copyStatus.textContent = copyButton.dataset.copySuccess;
      resetCopyState = window.setTimeout(() => {
        copyButton.classList.remove('is-copied');
        copyLabel.textContent = defaultLabel;
        copyIcon.textContent = '\u29C9';
        if (copyStatus) copyStatus.textContent = '';
      }, 1800);
    } catch {
      if (copyStatus) copyStatus.textContent = copyButton.dataset.copyFailure;
      copyButton.focus();
    } finally {
      copying = false;
      copyButton.removeAttribute('aria-busy');
    }
  });
});
