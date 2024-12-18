import type { Metadata } from "next";
import localFont from "next/font/local";
import "./styles/globals.css";
import Sidebar from "@/components/Sidebar";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="h-screen flex">
            {/* Menú lateral fijo */}
            <Sidebar />

            {/* Contenido principal con flex-grow */}
            <main className="flex-grow p-6 overflow-y-auto ml-0 bg-gray-100 dark:bg-gray-900 md:ml-64 mt-16 md:mt-14">
              {children}
              <ToastProvider />
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
