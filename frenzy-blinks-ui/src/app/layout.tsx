import type { Metadata } from "next";
import { Bebas_Neue, Fira_Code } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira",
});

export const metadata: Metadata = {
  title: "STRATA PROTOCOL",
  description: "50% Peace of Mind. 50% Full Throttle.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${bebasNeue.variable} ${firaCode.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}