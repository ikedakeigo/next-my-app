import type { Metadata } from "next";
import "./globals.css";
import Header from "./_compornents/Header";


export const metadata: Metadata = {
  title: "next|学習",
  description: "next.jsを用いて実装中",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
