import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "WANGHAF Fantasy League",
  description: "The weekly WANGHAF league betslip.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <footer className="site-footer">
          <span>WANGHAF Fantasy League</span>
        </footer>
      </body>
    </html>
  );
}
