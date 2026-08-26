import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/auth";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link className="brand" href="/" aria-label="WANGHAF home">
          <span className="brand-primary">WANGHAF</span>
          <span className="brand-secondary">Fantasy</span>
          <span className="brand-extra"> – League Betslip</span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          {user ? (
            <>
              <span className="nav-user">{user.displayName}</span>
              <form action={logout}>
                <button className="nav-button" type="submit">Sign out</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">Sign in</Link>
              <Link className="nav-cta" href="/signup">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
