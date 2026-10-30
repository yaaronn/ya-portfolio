
import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import MessageActions from "./MessageActions";

export const metadata = {
  title: "Message Inbox | YA Admin",
};

async function InboxContent({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  // Authenticate before processing the page or accessing data
  await requireAdmin();
  const params = await searchParams;
  const status = ["all", "unread", "read"].includes(params.status ?? "")
    ? params.status ?? "all"
    : "all";

  const [total, unread, read, messages] = await Promise.all([
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.contactMessage.count({ where: { isRead: true } }),
    prisma.contactMessage.findMany({
      where:
        status === "unread"
          ? { isRead: false }
          : status === "read"
            ? { isRead: true }
            : {},
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        message: true,
        isRead: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <main className="admin-inbox">
      <header className="admin-inbox-header">
        <div>
          <p className="admin-login-eyebrow">YA PORTFOLIO ADMIN</p>
          <h1>Message Inbox</h1>
          <p className="admin-inbox-subtitle">
            Messages submitted through your portfolio contact form.
          </p>
        </div>
        <Link href="/admin" className="admin-inbox-back">
          ← Dashboard
        </Link>
      </header>

      <section className="admin-inbox-stats" aria-label="Message counts">
        <article className="admin-inbox-stat">
          <span>Total messages</span>
          <strong>{total}</strong>
        </article>
        <article className="admin-inbox-stat">
          <span>Unread</span>
          <strong>{unread}</strong>
        </article>
        <article className="admin-inbox-stat">
          <span>Read</span>
          <strong>{read}</strong>
        </article>
      </section>

      <section className="admin-inbox-list">
        <div className="admin-inbox-list-heading">
          <h2>Recent messages</h2>
          <span>Newest first · Latest 100</span>
        </div>
        <nav className="admin-inbox-filters" aria-label="Filter messages">
          <Link
            href="/admin/inbox?status=all"
            aria-current={status === "all" ? "page" : undefined}
            className={status === "all" ? "active" : ""}
          >
            All ({total})
          </Link>

          <Link
            href="/admin/inbox?status=unread"
            aria-current={status === "unread" ? "page" : undefined}
            className={status === "unread" ? "active" : ""}
          >
            Unread ({unread})
          </Link>

          <Link
            href="/admin/inbox?status=read"
            aria-current={status === "read" ? "page" : undefined}
            className={status === "read" ? "active" : ""}
         >
            Read ({read})
          </Link>
        </nav>

        {messages.length === 0 ? (
          <div className="admin-inbox-empty">
            <h3>No messages yet</h3>
            <p>Messages submitted through your contact form will appear here.</p>
          </div>
        ) : (
          <div className="admin-inbox-table-wrap">
            <table className="admin-inbox-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Sender</th>
                  <th>Subject and message</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr key={message.id} className={message.isRead ? "" : "is-unread"}>
                    <td>
                      <span className={`admin-inbox-status ${message.isRead ? "read" : "unread"}`}>
                        {message.isRead ? "Read" : "Unread"}
                      </span>
                    </td>
                    <td>
                      <strong>{message.name}</strong>
                      <a href={`mailto:${message.email}`} className="admin-inbox-email">
                        {message.email}
                      </a>
                    </td>
                    <td>
                      <strong>{message.subject}</strong>
                      <p className="admin-inbox-preview">{message.message}</p>
                      <MessageActions
                        id={message.id}
                        name={message.name}
                        email={message.email}
                        subject={message.subject}
                        message={message.message}
                        isRead={message.isRead}
                      />
                    </td>
                    <td className="admin-inbox-date">
                      {new Intl.DateTimeFormat("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "Asia/Kolkata",
                      }).format(message.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default async function AdminInboxPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="admin-inbox">
          <p>Loading inbox…</p>
        </main>
      }
    >
      <InboxContent searchParams={searchParams} />
    </Suspense>
  );
}
