import type { Metadata } from "next";
import "../globals.css";
import { Footer, Navbar } from "@/components/ui";

export const metadata: Metadata = {
  title: "Portamordedor",
  description: "Pagina para la venta de portamordedores",
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
