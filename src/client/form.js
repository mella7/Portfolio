// "Get in touch" form. Sends the fields to the form's action URL with fetch
// (Netlify Forms by default) and reports the result in the page. If the
// request fails, the visitor is pointed to the e-mail address instead, so a
// message is never silently lost.

import { $, ui } from "./util.js";

export function initForm() {
  const form = $("[data-contact-form]");
  if (!form) return;
  const status = $("[data-status]", form);
  const submit = $('button[type="submit"]', form);
  const email = form.dataset.email;

  const say = (text, kind) => {
    status.textContent = text;
    status.className = `form__status${kind ? ` is-${kind}` : ""}`;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    // Honeypot: real visitors never see this field, so a value means a bot.
    if (data.get("bot-field")) {
      say(ui("gotIt"), "ok");
      form.reset();
      return;
    }

    submit.disabled = true;
    say(ui("sending"));
    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString(),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      say(ui("sent"), "ok");
      document.dispatchEvent(new CustomEvent("track", { detail: { name: "contact", data: {} } }));
      form.reset();
    } catch {
      say(ui("failed", { email }), "error");
    } finally {
      submit.disabled = false;
    }
  });
}
