"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="page-shell empty-state">
      <span className="auth-mark">!</span>
      <h1>We couldn&apos;t load the betslip.</h1>
      <p>Check the database connection and try again.</p>
      <button className="primary-button" onClick={reset} type="button">Try again</button>
    </main>
  );
}

