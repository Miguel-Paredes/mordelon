"use client";
import { useUser } from "@/app/hooks/us-user";
import { comicSansFont } from "@/config/font";
import { singOut } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useUser();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(!!user);
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(currentCart);
    }

    const handleCartUpdate = () => {
      const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(currentCart);
    };

    // Crear un evento para cuando se agreguen o quiten cosas al carrito
    window.addEventListener("cartUpdated", handleCartUpdate);

    // Limpieza del listener
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const isAdmin = user?.uid === process.env.NEXT_PUBLIC_ID_ADMINISTRADOR;

  const cerrarSesion = async () => {
    await singOut();
    setIsUserLoggedIn(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!user) {
      setIsUserLoggedIn(false);
    } else {
      setIsUserLoggedIn(true);
    }
  }, [user]);

  return (
    <div>
      <nav className="flex items-center justify-between flex-wrap bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-700 pl-2 pr-6 lg:px-20 py-2 shadow-lg lg:rounded-b-3xl">
        <Link
          href={"/"}
          className="flex items-center flex-shrink-0 text-white w-4/5 md:w-max"
        >
          <Image
            src="/logo.png"
            width={300}
            height={300}
            alt="manzana"
            className="w-16 h-16 rounded-full"
          />
          <h1
            className={`${comicSansFont.className} antialiased pl-3 text-xl md:text-2xl`}
          >
            Pequeño Mordelón
          </h1>
        </Link>
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        <div
          className={`${
            isOpen ? "flex" : "hidden"
          } absolute top-20 shadow-sm lg:shadow-none left-0 w-full opacity-100 rounded-b-2xl lg:rounded-none bg-cyan-700 lg:bg-transparent lg:static lg:flex lg:items-center lg:w-auto z-50`}
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 w-full p-4 lg:p-0">
            <Link
              href={"/collares-de-lactancia"}
              className="text-white rounded-lg hover:underline"
            >
              Collares
            </Link>
            <Link
              href={isAdmin ? "/productos/portachupon" : "/portachupon"}
              className="text-white rounded-lg hover:underline"
            >
              Portachupón
            </Link>
            <Link
              href={isAdmin ? "/productos/portamordedor" : "/portamordedor"}
              className="text-white rounded-lg hover:underline"
            >
              Portamordedor
            </Link>
            {!isAdmin && (
              <Link
                href={"/carrito"}
                className="text-white rounded-lg hover:underline"
              >
                Carrito
              </Link>
            )}
            {isUserLoggedIn && isAdmin && (
              <Link
                href={"/administrador"}
                className="text-white rounded-lg hover:underline"
              >
                Pedidos Clientes
              </Link>
            )}
            {isUserLoggedIn && !isAdmin && (
              <Link
                href={"/pedidos"}
                className="text-white rounded-lg hover:underline"
              >
                Pedidos
              </Link>
            )}
            {isUserLoggedIn ? (
              <button
                className="text-white rounded-lg hover:underline"
                onClick={cerrarSesion}
              >
                Cerrar Sesión
              </button>
            ) : (
              <Link
                href={"/auth"}
                className="text-white rounded-lg hover:underline"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </nav>
      <div
        className={`md:mx-4 flex ${
          !isUserLoggedIn ? "justify-between" : "justify-end"
        }`}
      >
        {!isUserLoggedIn && !isAdmin && (
          <span className="text-xs md:text-sm">
            Para poder realizar pedidos, por favor inicie sesión en su cuenta.
            Si aún no tiene una cuenta, puede registrarse fácilmente.{" "}
            <Link
              href={"auth/sign-up"}
              className="underline underline-offset-4 hover:text-primary text-muted-foreground"
            >
              Crear Cuenta
            </Link>
          </span>
        )}

        {!isAdmin && (
          <Link href={"/carrito"}>
            <div className="relative mr-8 mt-4">
              {cartItems && cartItems.length > 0 && (
                <span className="absolute text-xs rounded-full px-1 font-bold -top-2 -right-2 bg-blue-700 text-white">
                  {cartItems.length}
                </span>
              )}
              <TiShoppingCart className="w-6 h-6" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
