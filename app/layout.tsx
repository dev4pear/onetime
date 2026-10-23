import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { Web3Provider } from "./providers/Web3Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ONETIME - One launch. Every chain.",
  description: "Launch your token once on Ethereum. Deploy everywhere. The multichain launchpad for the future of crypto.",
  openGraph: {
    title: "ONETIME - One launch. Every chain.",
    description: "Launch your token once on Ethereum. Deploy everywhere.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        <Web3Provider>
          <Navigation />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </Web3Provider>
      </body>
    </html>
  );
}
