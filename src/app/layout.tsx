import type { Metadata } from "next";
import "./globals.css";
import "./polish.css";
import "./hera.css";
import "./consultation-form.css";
import "./internal-pages.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "HEBARO — Tecnología para crecer",
  description: "Tecnología, personas y comunidades. Un ecosistema para conectar y hacer crecer a Puerto Rico.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="preload" href="/public/images/Hebaro%20imagen%20fondo.png" as="image" fetchPriority="high" />
      </head>
      <body>{children}</body>
    </html>
  );
}
