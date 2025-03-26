"use client";

import { Suspense } from "react";
import { Inter } from "next/font/google";
import { QueryClientProvider } from "react-query";
import { LanguageProvider } from "@contexts/LanguageProvider";
import { AuthProvider } from "@contexts/AuthProvider";
import { FontSizeProvider } from "@contexts/FontSizeProvider";
import { ColorblindProvider } from "@contexts/ColorblindProvider";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "next-themes";
import queryClient from "@config/queryClient/config";
import Spinner from "@components/common/Spinner/Spinner";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextTopLoader color="#2563EB" showSpinner={false} />
        <ToastContainer
          position="top-center"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          style={{ zIndex: 99999 }}
        />
        <ThemeProvider>
          <ColorblindProvider>
            <FontSizeProvider>
              <QueryClientProvider client={queryClient}>
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center min-h-screen">
                      <Spinner style="large" />
                    </div>
                  }
                >
                  <AuthProvider>
                    <LanguageProvider>{children}</LanguageProvider>
                  </AuthProvider>
                </Suspense>
              </QueryClientProvider>
            </FontSizeProvider>
          </ColorblindProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
