import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { SWRProvider } from "./components/SWRProvider";
import { SNLProvider } from "../context";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: "SNL Live Checker - Is Saturday Night Live Live Tonight?",
  description: "Instantly know if Saturday Night Live is live tonight or a rerun. Never miss a live show again!",
  keywords: "SNL, Saturday Night Live, live, rerun, comedy, TV schedule",
  authors: [{ name: "SNL Live Checker" }],
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
      <body className="antialiased">
        <SWRProvider>
          <SNLProvider>
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
                  theme="light"
                />
              </ThemeProvider>
            </ErrorBoundary>
          </SNLProvider>
        </SWRProvider>
      </body>
    </html>
  );
}
