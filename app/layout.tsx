import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  fallback: ["sans-serif"],
});

export const metadata: Metadata = {
  title: "Plataforma Educativa Sector Agro",
  description:
    "Plataforma Educativa Sector Agro — panel administrativo, puntos digitales y agente de WhatsApp para capacitación agropecuaria.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <div className="mesh-bg" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        {children}
      </body>
    </html>
  );
}
