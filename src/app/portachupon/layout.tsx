import type { Metadata } from "next";
import "../globals.css";
import { Footer, Navbar } from "@/components/ui";

export const metadata: Metadata = {
  title: "Portachupón",
  description: "Pagina para la venta de portachupones",
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
