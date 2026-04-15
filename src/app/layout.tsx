import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Will I Survive This? | A Morbid Historical Fate Calculator",
  description:
    "Enter a historical year and your modern profession to discover, in grim and glorious detail, exactly how quickly you would have perished. Survival not guaranteed.",
  keywords: ["history", "survival", "morbid", "fun", "historical fate"],
  openGraph: {
    title: "Will I Survive This?",
    description: "How long would YOU last in history?",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
