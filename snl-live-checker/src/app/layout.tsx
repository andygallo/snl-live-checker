import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { SNLProvider } from "../context/SNLContext";
import { SWRProvider } from "./components/SWRProvider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "SNL Live Checker - Is Saturday Night Live Live Tonight?",
  description: "Instantly know if Saturday Night Live is live tonight or a rerun. Never miss a live show again!",
  keywords: "SNL, Saturday Night Live, live, rerun, comedy, TV schedule",
  authors: [{ name: "SNL Live Checker" }],
  openGraph: {
    title: 'SNL Live Checker',
    description: 'Is Saturday Night Live live tonight? Find out instantly!',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SNL Live Checker',
    description: 'Is Saturday Night Live live tonight? Find out instantly!',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <SWRProvider>
          <SNLProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </SNLProvider>
        </SWRProvider>
      </body>
    </html>
  );
}
