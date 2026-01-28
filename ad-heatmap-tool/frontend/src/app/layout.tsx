import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ad Heatmap Analyzer - AI-Powered Attention & Click Prediction",
  description: "Analyze your digital ads with AI-powered attention heatmaps and click predictions. Get actionable insights based on eye-tracking research.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
