import inputStyles from '../TextInput/TextInput.module.css';
import textareaStyles from '../TextArea/TextArea.module.css';

// Implements ContactForm.astro's behavior (BL-022, D-009): client-side validation matching
// ERROR_STATES.md#E-010's visual pattern (icon + text, wired via aria-describedby, never
// color-only), honeypot spam handling, and submit → success/failure (E-030) states.
//
// Deliberately vanilla (no React hydration) per D-009 — reuses TextInput/TextArea's own
// CSS Modules so an injected error matches their rendered error markup exactly.
//
// Posts to `/api/contact`, which does not exist on this GitHub Pages deployment yet (no
// serverless runtime, no hosting/email-vendor decision — DECISION_LOG.md D-009, Proposed). Real
// visitors will see the fetch fail and land on the honest E-030 failure state with the phone/
// email fallback until that decision is made and the function is built.

type FieldStyles = typeof inputStyles;

const ERROR_ICON =
  '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">' +
  '<circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5" />' +
  '<path d="M8 4.5v4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />' +
  '<circle cx="8" cy="11.25" r="0.9" fill="currentColor" /></svg>';

interface FieldError {
  input: HTMLInputElement | HTMLTextAreaElement;
  styles: FieldStyles;
  message: string;
}

function setFieldError(
  input: HTMLInputElement | HTMLTextAreaElement,
  styles: FieldStyles,
  message: string | null,
) {
  const errorId = `${input.id}-error`;
  const helperId = `${input.id}-helper`;
  const helperEl = document.getElementById(helperId);
  let errorEl = document.getElementById(errorId);

  if (message) {
    input.classList.add(styles.hasError);
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorId);
    if (helperEl) helperEl.hidden = true;
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.id = errorId;
      errorEl.className = styles.errorText;
      input.insertAdjacentElement('afterend', errorEl);
    }
    errorEl.innerHTML = `${ERROR_ICON}${message}`;
    return;
  }

  input.classList.remove(styles.hasError);
  input.removeAttribute('aria-invalid');
  if (helperEl) {
    helperEl.hidden = false;
    input.setAttribute('aria-describedby', helperId);
  } else {
    input.removeAttribute('aria-describedby');
  }
  errorEl?.remove();
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface InitContactFormOptions {
  /** Injectable for tests; defaults to the global fetch. */
  fetchImpl?: typeof fetch;
}

export function initContactForm(form: HTMLFormElement, options: InitContactFormOptions = {}) {
  const fetchImpl = options.fetchImpl ?? window.fetch.bind(window);

  const nameInput = form.querySelector<HTMLInputElement>('#contact-name');
  const emailInput = form.querySelector<HTMLInputElement>('#contact-email');
  const phoneInput = form.querySelector<HTMLInputElement>('#contact-phone');
  const messageInput = form.querySelector<HTMLTextAreaElement>('#contact-message');
  const honeypot = form.querySelector<HTMLInputElement>('#contact-hp-field');
  const submitButton = form.querySelector<HTMLButtonElement>('[data-contact-submit]');
  const successBox = form.querySelector<HTMLElement>('[data-contact-success]');
  const errorBox = form.querySelector<HTMLElement>('[data-contact-error]');

  if (
    !nameInput ||
    !emailInput ||
    !messageInput ||
    !honeypot ||
    !submitButton ||
    !successBox ||
    !errorBox
  ) {
    return;
  }

  const originalSubmitLabel = submitButton.textContent ?? 'Send message';

  function collectErrors(): FieldError[] {
    const errors: FieldError[] = [];
    if (!nameInput!.value.trim()) {
      errors.push({ input: nameInput!, styles: inputStyles, message: 'Please enter your name.' });
    }
    const emailValue = emailInput!.value.trim();
    if (!emailValue) {
      errors.push({
        input: emailInput!,
        styles: inputStyles,
        message: 'Please enter your email address.',
      });
    } else if (!EMAIL_PATTERN.test(emailValue)) {
      errors.push({
        input: emailInput!,
        styles: inputStyles,
        message: "That email doesn't look complete.",
      });
    }
    if (!messageInput!.value.trim()) {
      errors.push({
        input: messageInput!,
        styles: textareaStyles,
        message: 'Please enter a message.',
      });
    }
    return errors;
  }

  function clearAllFieldErrors() {
    setFieldError(nameInput!, inputStyles, null);
    setFieldError(emailInput!, inputStyles, null);
    setFieldError(messageInput!, textareaStyles, null);
  }

  function hideResults() {
    successBox!.hidden = true;
    errorBox!.hidden = true;
  }

  function showSuccess() {
    hideResults();
    successBox!.hidden = false;
    successBox!.querySelector<HTMLElement>('[role="status"]')?.focus();
  }

  function showFailure() {
    hideResults();
    errorBox!.hidden = false;
    errorBox!.querySelector<HTMLElement>('[role="alert"]')?.focus();
  }

  // Button.tsx's spinner is a build-time React conditional (`isLoading` prop) — reusing it here
  // would mean shipping React just to toggle a spinner. Simplified equivalent that stays within
  // vanilla JS: disable the button (Button.module.css already dims :disabled) and swap its label
  // text, which conveys the same "request in flight" state without the animation.
  function setSubmitting(submitting: boolean) {
    submitButton!.disabled = submitting;
    submitButton!.setAttribute('aria-busy', submitting ? 'true' : 'false');
    const label = submitButton!.querySelector('span') ?? submitButton!;
    label.textContent = submitting ? 'Sending…' : originalSubmitLabel;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    hideResults();

    // Spam trap: a real visitor never fills this (off-screen, not tabbable, aria-hidden). A bot
    // that fills every field it finds gets a fake success — never told it was caught, and nothing
    // is ever sent to the network for this submission (BL-022 acceptance: "honeypot verified").
    if (honeypot!.value.trim()) {
      form.reset();
      showSuccess();
      return;
    }

    clearAllFieldErrors();
    const errors = collectErrors();
    if (errors.length > 0) {
      for (const { input, styles, message } of errors) {
        setFieldError(input, styles, message);
      }
      errors[0].input.focus();
      return;
    }

    setSubmitting(true);
    fetchImpl('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nameInput!.value.trim(),
        email: emailInput!.value.trim(),
        phone: phoneInput?.value.trim() ?? '',
        message: messageInput!.value.trim(),
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Unexpected response: ${response.status}`);
        form.reset();
        showSuccess();
      })
      .catch(() => {
        // Preserve entered text (no form.reset()) per ERROR_STATES.md#E-030.
        showFailure();
      })
      .finally(() => {
        setSubmitting(false);
      });
  });
}
