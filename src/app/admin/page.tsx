
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin-auth";
import { signOut } from "@/auth";
import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="admin-login-page">
      <Suspense
        fallback={
          <section className="admin-login-card">
            <p className="admin-login-description">Loading dashboard...</p>
          </section>
        }
      >
        <AdminDashboard />
      </Suspense>
    </main>
  );
}

async function AdminDashboard() {
  const session = await requireAdmin();

  return (
    <section className="admin-login-card">
      <p className="admin-login-eyebrow">YA PORTFOLIO ADMIN</p>

      <h1>Dashboard</h1>

      <p className="admin-login-description">
        Signed in as {session.user?.email}.
      </p>

      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        <Link href="/admin/inbox" className="admin-inbox-back">
          Open message inbox →
        </Link>
     </div>


      <p>
        Authentication is working. Your message inbox will be added next.
      </p>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/admin/login" });
        }}
      >
        <button className="admin-login-form" type="submit">
          Sign out
        </button>
      </form>
    </section>
  );
}
