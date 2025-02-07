import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Página de contacto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
