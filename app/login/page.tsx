import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/");

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-card-header">
          <p className="auth-wordmark"><span>WANGHAF</span> Fantasy – League Betslip</p>
          <p className="eyebrow">Welcome back</p>
          <h1>Sign in to WANGHAF</h1>
          <p>Get your weekly pick onto the league betslip.</p>
        </div>
        <AuthForm mode="login" />
      </section>
    </main>
  );
}
