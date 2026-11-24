/* ==========================================================
   contact.js - contact form validation
   NOTE: a website made only with HTML/CSS/JS cannot send email by itself.
   To really receive messages, connect the form to a service such as
   Formspree, Web3Forms or EmailJS (see README.md). Until then, this form
   only CHECKS the input and offers an "Open in email app" button.
   ========================================================== */
const OWNER_EMAIL = 'shelirai@gmail.com';

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('form-status');

  // Pre-fill the subject when coming from a service card (?service=...)
  const service = new URLSearchParams(location.search).get('service');
  if (service) form.subject.value = 'Enquiry about: ' + service;

  const rules = {
    name: (v) => (v.trim().length < 2 ? 'Please enter your full name (at least 2 characters).' : ''),
    email: (v) => (!v.trim() ? 'Please enter your email address.'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? 'Please enter a valid email, like name@example.com.' : ''),
    subject: (v) => (v.trim().length < 3 ? 'Please add a short subject (at least 3 characters).' : ''),
    message: (v) => (v.trim().length < 20 ? 'Your message needs at least 20 characters (' + v.trim().length + ' so far).' : ''),
  };

  function validateField(name) {
    const field = form.elements[name];
    const error = rules[name](field.value);
    field.closest('.form-group').classList.toggle('has-error', Boolean(error));
    field.setAttribute('aria-invalid', String(Boolean(error)));
    document.getElementById(name + '-error').textContent = error;
    return !error;
  }

  Object.keys(rules).forEach((name) => form.elements[name].addEventListener('blur', () => validateField(name)));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.classList.remove('show');
    const results = Object.keys(rules).map(validateField);
    if (results.includes(false)) {
      const firstBad = form.querySelector('.has-error input, .has-error textarea');
      if (firstBad) firstBad.focus();
      return;
    }
    const body = 'Name: ' + form.name.value + '\nEmail: ' + form.email.value + '\n\n' + form.message.value;
    const mailto = 'mailto:' + OWNER_EMAIL + '?subject=' + encodeURIComponent(form.subject.value) + '&body=' + encodeURIComponent(body);
    status.innerHTML = '<strong><i class="fa-solid fa-circle-check"></i> Your form is valid.</strong><br>' +
      'This demo website has no server, so the message has <strong>not</strong> been sent. ' +
      'Use the button below to send it from your own email app.<br>' +
      '<a class="btn btn-primary btn-sm" href="' + mailto + '"><i class="fa-solid fa-envelope"></i> Open in email app</a>';
    status.classList.add('show');
    status.focus();
  });

  form.addEventListener('reset', () => {
    form.querySelectorAll('.has-error').forEach((g) => g.classList.remove('has-error'));
    form.querySelectorAll('.field-error').forEach((p) => (p.textContent = ''));
    status.classList.remove('show');
  });
}

document.addEventListener('DOMContentLoaded', initContactForm);
