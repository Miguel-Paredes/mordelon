import type { Metadata } from "next";
import "../globals.css";
import { Footer, Navbar } from "@/components/ui";

export const metadata: Metadata = {
  title: "Collares de Lactancia",
  description: "Pagina para la venta de collares de lactancia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
