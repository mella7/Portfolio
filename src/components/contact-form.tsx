"use client";

import { Button } from "@/components/ui/button";
import { track } from "@/lib/track";
import { useState, type FormEvent } from "react";
import { Loader2Icon, SendIcon } from "lucide-react";

// Contact form - submits via Formspree (https://formspree.io), a hosted form
// backend that emails submissions straight to your inbox. No server code,
// no API route, works the same on Netlify/Vercel/anywhere.
//
// SETUP (one-time, ~2 minutes):
// 1. Create a free account at https://formspree.io and make a new form.
// 2. Copy its endpoint (looks like https://formspree.io/f/xxxxxxxx).
// 3. Paste it below in place of the placeholder.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm({
  labels,
  email,
}: {
  labels: {
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
    success: string;
    error: string;
  };
  email: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const configured = !FORMSPREE_ENDPOINT.includes("YOUR_FORM_ID");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!configured) return;

    const form = e.currentTarget;
    setStatus("sending");

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        track("contact-form-sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 w-full max-w-md"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          {labels.name}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder={labels.namePlaceholder}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          {labels.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder={labels.emailPlaceholder}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          {labels.message}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder={labels.messagePlaceholder}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={status === "sending" || status === "success"}
        className="gap-1.5 mt-1 transition-all"
      >
        {status === "sending" ? (
          <>
            <Loader2Icon className="size-3.5 animate-spin" />
            {labels.sending}
          </>
        ) : (
          <>
            <SendIcon className="size-3.5" />
            {labels.send}
          </>
        )}
      </Button>

      {status === "success" && (
        <p className="text-sm text-green-600 dark:text-green-400 transition-opacity animate-in fade-in">
          {labels.success}
        </p>
      )}
      {(status === "error" || !configured) && status !== "success" && (
        <p className="text-sm text-muted-foreground">
          {status === "error" ? labels.error + " " : ""}
          You can also reach me directly at{" "}
          <a href={`mailto:${email}`} className="underline underline-offset-4">
            {email}
          </a>
          .
        </p>
      )}
    </form>
  );
}
