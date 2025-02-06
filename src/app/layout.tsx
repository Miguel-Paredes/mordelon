'use client'
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { useUser } from "./hooks/us-user";
import { redirect, usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useUser();
  const pathName = usePathname();
  // Definimos las rutas a las que no se deben de acceder si esta logueado
  const authRoutes = ["/auth", "/auth/sign-up", "/auth/forgot-password"]
  // Verifica las rutas en las que se encuentra el usuario
  const isInAuthRoutes = authRoutes.includes(pathName)
  if(user&&isInAuthRoutes) return redirect('/')
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster/>
      </body>
    </html>
  );
}
