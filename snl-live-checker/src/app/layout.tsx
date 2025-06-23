import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { SWRProvider } from "./components/SWRProvider";
import { SNLProvider } from "@/context";
import { SNLDataProvider } from '@/context/SNLDataProvider';
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            <SNLDataProvider>
              <ErrorBoundary>
                <ThemeProvider>
                  {children}
                  <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                  />
                </ThemeProvider>
              </ErrorBoundary>
            </SNLDataProvider>
          </SNLProvider>
        </SWRProvider>
      </body>
    </html>
  );
}
