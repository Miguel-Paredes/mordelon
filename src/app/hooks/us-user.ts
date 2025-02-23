"use client";
import { User } from "@/interfaces/user.interfaces";
import { auth, getDocument } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getFromLoacalStorage, setInLoacalStorage } from "../actions";

export const useUser = () => {
  const [user, setUser] = useState<User | undefined | DocumentData>(undefined);
  const pathname = usePathname();
  const router = useRouter();

  // Rutas protegidas para usuarios no autenticados
  const protectedRoutes = ["/pedidos", "/administrador", "/productos/portachupon", "/productos/api/upload", "/productos/api/delete"];

  // Rutas exclusivas para el administrador
  const adminOnlyRoutes = ["/administrador", "/productos/portachupon", "/productos/api/upload", "/productos/api/delete"];
  // const adminOnlyRoutes = ["/administrador"];

  // Rutas exclusivas para clientes
  const clientOnlyRoutes = ["/pedidos", "/carrito"];

  // Función para obtener el usuario desde Firestore
  const getUserFromDB = async (uid: string) => {
    const path = `users/${uid}`;
    try {
      const res = await getDocument(path);
      setUser(res);
      setInLoacalStorage("user", res);
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // Verificar si el usuario ya está en localStorage
        const userInLocal = getFromLoacalStorage("user");
        if (userInLocal) {
          setUser(userInLocal);
        } else {
          await getUserFromDB(authUser.uid);
        }

        // Verificar si el usuario es el administrador
        const isAdmin =
          authUser.uid === process.env.NEXT_PUBLIC_ID_ADMINISTRADOR;

        // Redirigir según el rol del usuario
        if (isAdmin && clientOnlyRoutes.includes(pathname)) {
          router.push("/administrador"); // Redirigir al administrador fuera de rutas de cliente
        } else if (!isAdmin && adminOnlyRoutes.includes(pathname)) {
          router.push("/"); // Redirigir a usuarios no administradores fuera de rutas de administrador
        }
      } else {
        // Si no hay usuario autenticado, limpiar el estado y redirigir
        setUser(undefined);
        if (protectedRoutes.includes(pathname)) {
          router.push("/auth");
        }
      }
    });

    return () => unsubscribe(); // Limpiar el listener al desmontar el componente
  }, [pathname, router]);

  return user;
};
