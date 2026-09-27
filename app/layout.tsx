import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "./store";
import { Nav } from "./nav";

export const metadata: Metadata = {
  title: "Fieldwork | Demo Commerce",
  description: "A demo storefront with repeatable browser failures for extension testing.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased"><StoreProvider><Nav />{children}</StoreProvider></body>
      <script src="http://localhost:4000/sdk.js" data-project="fieldwork" async></script>

    </html>
  );
}
