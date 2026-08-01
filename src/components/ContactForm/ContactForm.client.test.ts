import { axe } from 'jest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import inputStyles from '../TextInput/TextInput.module.css';
import textareaStyles from '../TextArea/TextArea.module.css';
import { initContactForm } from './ContactForm.client';

// Implements ContactForm.astro's behavior (BL-022): client-side validation (E-010 pattern),
// honeypot spam handling, and submit → success/failure (E-030) states. Exercises
// initContactForm directly against a fixture matching ContactForm.astro's rendered markup,
// same approach SiteHeader.client.test.ts uses for its now-server-rendered component.
function renderFixture(fetchImpl: ReturnType<typeof vi.fn>) {
  document.body.innerHTML = `
    <form data-contact-form novalidate>
      <div class="field">
        <label for="contact-name">Name *</label>
        <input id="contact-name" name="name" required />
      </div>
      <div class="field">
        <label for="contact-email">Email *</label>
        <input id="contact-email" name="email" type="email" required />
      </div>
      <div class="field">
        <label for="contact-phone">Phone (optional)</label>
        <input id="contact-phone" name="phone" type="tel" />
      </div>
      <div class="field">
        <label for="contact-message">Message *</label>
        <textarea id="contact-message" name="message" required></textarea>
        <span id="contact-message-helper">Please don't include medical details.</span>
      </div>
      <div aria-hidden="true">
        <label for="contact-hp-field">Leave this field blank</label>
        <input id="contact-hp-field" name="hp_field" tabindex="-1" autocomplete="off" />
      </div>
      <button type="submit" data-contact-submit><span>Send message</span></button>
      <div data-contact-success hidden>
        <div role="status" tabindex="-1">Thanks for reaching out.</div>
      </div>
      <div data-contact-error hidden>
        <div role="alert" tabindex="-1">Your message didn't send.</div>
      </div>
    </form>
  `;
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]')!;
  // Cast: vi.fn()'s inferred Mock type doesn't structurally match fetch's overloaded signature,
  // but the test doubles below only ever need to resolve/reject like fetch does.
  initContactForm(form, { fetchImpl: fetchImpl as unknown as typeof fetch });
  return {
    form,
    nameInput: document.querySelector<HTMLInputElement>('#contact-name')!,
    emailInput: document.querySelector<HTMLInputElement>('#contact-email')!,
    phoneInput: document.querySelector<HTMLInputElement>('#contact-phone')!,
    messageInput: document.querySelector<HTMLTextAreaElement>('#contact-message')!,
    honeypot: document.querySelector<HTMLInputElement>('#contact-hp-field')!,
    submitButton: document.querySelector<HTMLButtonElement>('[data-contact-submit]')!,
    successBox: document.querySelector<HTMLElement>('[data-contact-success]')!,
    errorBox: document.querySelector<HTMLElement>('[data-contact-error]')!,
  };
}

function submit(form: HTMLFormElement) {
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

describe('initContactForm', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('shows inline errors for empty required fields and focuses the first one, without calling fetch', () => {
    const fetchImpl = vi.fn();
    const { form, nameInput, successBox, errorBox } = renderFixture(fetchImpl);

    submit(form);

    expect(nameInput).toHaveFocus();
    expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    expect(document.getElementById('contact-name-error')).toHaveTextContent(
      'Please enter your name.',
    );
    expect(document.getElementById('contact-email-error')).toHaveTextContent(
      'Please enter your email address.',
    );
    expect(document.getElementById('contact-message-error')).toHaveTextContent(
      'Please enter a message.',
    );
    expect(nameInput.classList.contains(inputStyles.hasError)).toBe(true);
    expect(successBox.hidden).toBe(true);
    expect(errorBox.hidden).toBe(true);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('rejects an incomplete email address', () => {
    const fetchImpl = vi.fn();
    const { form, emailInput } = renderFixture(fetchImpl);
    emailInput.value = 'not-an-email';

    submit(form);

    expect(document.getElementById('contact-email-error')).toHaveTextContent(
      "That email doesn't look complete.",
    );
  });

  it('hides the message helper text and shows the error, restoring the helper once fixed', async () => {
    const fetchImpl = vi.fn();
    const { form, successBox, messageInput } = renderFixture(fetchImpl);
    const helper = document.getElementById('contact-message-helper')!;

    submit(form);
    expect(helper.hidden).toBe(true);
    expect(messageInput).toHaveAttribute('aria-describedby', 'contact-message-error');
    expect(messageInput.classList.contains(textareaStyles.hasError)).toBe(true);

    document.querySelector<HTMLInputElement>('#contact-name')!.value = 'Jordan Rivera';
    document.querySelector<HTMLInputElement>('#contact-email')!.value = 'jordan@example.com';
    messageInput.value = 'Hello, I have a billing question.';
    fetchImpl.mockResolvedValueOnce({ ok: true });

    submit(form);
    expect(helper.hidden).toBe(false);
    expect(messageInput).toHaveAttribute('aria-describedby', 'contact-message-helper');
    await vi.waitFor(() => expect(successBox.hidden).toBe(false));
  });

  it('submits valid data to /api/contact and shows the success state, resetting the form', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true });
    const { form, nameInput, emailInput, messageInput, successBox, errorBox } =
      renderFixture(fetchImpl);
    nameInput.value = 'Jordan Rivera';
    emailInput.value = 'jordan@example.com';
    messageInput.value = 'Hello, I have a billing question.';

    submit(form);
    await vi.waitFor(() => expect(successBox.hidden).toBe(false));

    expect(fetchImpl).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({ method: 'POST' }),
    );
    const body = JSON.parse(fetchImpl.mock.calls[0][1].body);
    expect(body).toEqual({
      name: 'Jordan Rivera',
      email: 'jordan@example.com',
      phone: '',
      message: 'Hello, I have a billing question.',
    });
    expect(errorBox.hidden).toBe(true);
    expect(nameInput.value).toBe('');
    expect(document.querySelector('[role="status"]')).toHaveFocus();
  });

  it('shows the E-030 failure state and preserves entered text when the request fails', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('network down'));
    const { form, nameInput, emailInput, messageInput, successBox, errorBox } =
      renderFixture(fetchImpl);
    nameInput.value = 'Jordan Rivera';
    emailInput.value = 'jordan@example.com';
    messageInput.value = 'Hello, I have a billing question.';

    submit(form);
    await vi.waitFor(() => expect(errorBox.hidden).toBe(false));

    expect(successBox.hidden).toBe(true);
    // Entered text preserved (no form.reset()) per ERROR_STATES.md#E-030.
    expect(nameInput.value).toBe('Jordan Rivera');
    expect(messageInput.value).toBe('Hello, I have a billing question.');
    expect(document.querySelector('[role="alert"]')).toHaveFocus();
  });

  it('re-enables the submit button and restores its label after a failed request', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('network down'));
    const { form, nameInput, emailInput, messageInput, submitButton } = renderFixture(fetchImpl);
    nameInput.value = 'Jordan Rivera';
    emailInput.value = 'jordan@example.com';
    messageInput.value = 'Hello, I have a billing question.';

    submit(form);
    expect(submitButton.disabled).toBe(true);
    expect(submitButton.textContent).toBe('Sending…');

    await vi.waitFor(() => expect(submitButton.disabled).toBe(false));
    expect(submitButton.textContent).toBe('Send message');
  });

  it('treats a filled honeypot as spam: fakes success, never calls fetch', () => {
    const fetchImpl = vi.fn();
    const { form, honeypot, successBox } = renderFixture(fetchImpl);
    honeypot.value = 'I am a bot';

    submit(form);

    expect(successBox.hidden).toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('is axe-clean at rest, with field errors shown, and with the success state shown', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true });
    const { form, nameInput, emailInput, messageInput } = renderFixture(fetchImpl);
    expect(await axe(form)).toHaveNoViolations();

    submit(form);
    expect(await axe(form)).toHaveNoViolations();

    nameInput.value = 'Jordan Rivera';
    emailInput.value = 'jordan@example.com';
    messageInput.value = 'Hello, I have a billing question.';
    submit(form);
    await vi.waitFor(() => expect(document.querySelector('[data-contact-success]')).not.toBeNull());
    expect(await axe(form)).toHaveNoViolations();
  });
});
