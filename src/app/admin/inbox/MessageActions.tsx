
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
type MessageActionsProps = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
};

export default function MessageActions({
  id,
  name,
  email,
  subject,
  message,
  isRead: initialIsRead,
}: MessageActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRead, setIsRead] = useState(initialIsRead);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function toggleReadStatus() {
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !isRead }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not update message.");
      }

      setIsRead(data.message.isRead);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setIsSaving(false);
    }
  }
  async function deleteMessage() {
  const confirmed = window.confirm(
    "Are you sure you want to permanently delete this message?"
  );

  if (!confirmed) return;

  setIsSaving(true);
  setError("");

  try {
    const response = await fetch(`/api/admin/messages/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Could not delete message.");
    }

    setIsOpen(false);
    router.refresh();
  } catch (err) {
    setError(
      err instanceof Error ? err.message : "Something went wrong."
    );
  } finally {
    setIsSaving(false);
  }
}

  return (
    <>
      <button
        type="button"
        className="admin-message-action"
        onClick={() => setIsOpen(true)}
      >
        View message
      </button>

      {isOpen && (
        <div
          className="admin-message-overlay"
          onClick={() => setIsOpen(false)}
        >
          <section
            className="admin-message-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`message-title-${id}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="admin-message-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close message"
            >
              ×
            </button>

            <p className="admin-login-eyebrow">CONTACT MESSAGE</p>
            <h2 id={`message-title-${id}`}>{subject}</h2>

            <p><strong>From:</strong> {name}</p>
            <p>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${email}`}>{email}</a>
            </p>

            <div className="admin-message-body">{message}</div>

            <p>
              Status: <strong>{isRead ? "Read" : "Unread"}</strong>
            </p>

            {error && <p role="alert">{error}</p>}

            <button
              type="button"
              className="admin-message-action"
              onClick={toggleReadStatus}
              disabled={isSaving}
            >
              {isSaving
                ? "Saving…"
                : isRead
                  ? "Mark as unread"
                  : "Mark as read"}
            </button>

            <button
              type="button"
              className="admin-message-delete"
              onClick={deleteMessage}
              disabled={isSaving}
            >
              {isSaving ? "Please wait…" : "Delete message"}
            </button>
          </section>
        </div>
      )}
    </>
  );
}
