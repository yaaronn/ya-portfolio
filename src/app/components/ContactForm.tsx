
"use client";

import { FormEvent, useState } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "loading") return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      subject: String(formData.get("subject") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result: { message?: string } = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to submit your message.");
      }

      setStatus("success");
      setFeedback(
       "Your message has been saved successfully!"
      );
      form.reset();
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-fields">
        <label>
          Your name
          <input
            name="name"
            type="text"
            placeholder="How should I address you?"
            autoComplete="name"
            maxLength={100}
            required
            disabled={status === "loading"}
          />
        </label>

        <label>
          Email address
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            maxLength={254}
            required
            disabled={status === "loading"}
          />
        </label>
      </div>

      <label>
        Subject
        <input
          name="subject"
          type="text"
          placeholder="What would you like to discuss?"
          maxLength={150}
          required
          disabled={status === "loading"}
        />
      </label>

      <label>
        Message
        <textarea
          name="message"
          placeholder="Tell me about your idea, project, or opportunity..."
          rows={5}
          maxLength={5000}
          required
          disabled={status === "loading"}
        />
      </label>

      <button
        className="button button-primary contact-submit"
        type="submit"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Sending..." : "Send message"}
        {status !== "loading" && <span aria-hidden="true">↗</span>}
      </button>

      <p
        className={`form-feedback ${status}`}
        role="status"
        aria-live="polite"
      >
        {feedback}
      </p>
    </form>
  );
}
