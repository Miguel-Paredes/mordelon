"use client";
import { useUser } from "@/app/hooks/us-user";
import { comicSansFont, titleFont } from "@/config/font";
import { singOut } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useUser();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(!!user);

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
    <nav className="flex items-center justify-between flex-wrap bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-700 pl-2 pr-6 lg:px-20 py-2 shadow-lg lg:rounded-b-3xl">
      <div className="flex items-center flex-shrink-0 text-white w-4/5 md:w-max">
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
      </div>
      <div className="lg:hidden">
        <button onClick={toggleMenu} className="text-white focus:outline-none">
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      <div
        className={`${
          isOpen ? "flex" : "hidden"
        } absolute top-20 shadow-sm lg:shadow-none left-0 w-full opacity-100 rounded-b-2xl lg:rounded-none bg-cyan-700 lg:bg-transparent lg:static lg:flex lg:items-center lg:w-auto z-50`}
      >
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 w-full p-4 lg:p-0">
          <Link href="/" className="text-white rounded-lg hover:underline">
            Inicio
          </Link>
          <Link href={"/collares-de-lactancia"} className="text-white rounded-lg hover:underline">
            Collares
          </Link>
          <Link href={"/portachupon"} className="text-white rounded-lg hover:underline">
            Portachupón
          </Link>
          <Link href={"/portamordedor"} className="text-white rounded-lg hover:underline">
            Portamordedor
          </Link>
          <Link href={"/contacto"} className="text-white rounded-lg hover:underline">
            Contacto
          </Link>
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
  );
};
