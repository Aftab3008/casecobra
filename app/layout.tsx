import type { Metadata } from "next";
import { Recursive } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Toaster } from "sonner";
import Provider from "./_providers/Provider";

const recursive = Recursive({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CaseCobra",
  description: "CaseCobra allows you to customize your own phone case.",
  icons: ["/snake-1.png"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={recursive.className}>
        <Navbar />
        <main className="flex grainy-light flex-col min-h-[calc(100vh-3.5rem-1px)]">
          <div className="flex flex-1 flex-col h-full">
            <Provider>{children}</Provider>
          </div>
          <Footer />
          <Toaster richColors position="top-center" />
        </main>
      </body>
    </html>
  );
}
