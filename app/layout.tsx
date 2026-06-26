import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Staylight — Find stays that fit the way you travel",
  description:
    "Discover premium stays with Smart Match — clear fit scores and reasons for every result.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full font-sans">
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}
