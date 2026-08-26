import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  if (await getCurrentUser()) redirect("/");

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-card-header">
          <p className="auth-wordmark"><span>WANGHAF</span> Fantasy – League Betslip</p>
          <p className="eyebrow">Open registration</p>
          <h1>Join the league</h1>
        </div>
        <AuthForm mode="signup" />
      </section>
    </main>
  );
}
