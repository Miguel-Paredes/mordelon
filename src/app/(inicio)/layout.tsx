import type { Metadata } from "next";
import "../globals.css";
import { Footer, Navbar } from "@/components/ui";

export const metadata: Metadata = {
  title: "Pequeño Mordelón",
  description: "Una página web diseñada a la venta de productos para bebes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
