import { titleFont } from "@/config/font";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6 w-4/5 md:w-max">
        <Image
          src="/logo.png"
          width={1000}
          height={1000}
          alt="manzana"
          className="w-16 h-16 rounded-full"
        />
        <h1
          className={`${titleFont.className} antialiased pt-4 pl-3 text-3xl md:text-5xl`}
        >
          Pequeño Mordelón
        </h1>
      </div>
      <div className="hidden md:block w-max">
        <div className="flex justify-between w-full">
            <Link href={"/"} className="mx-2 p-4 bg-black text-white rounded-lg hover:underline hover:bg-gray-500">
            Inicio
            </Link>
            <Link href={""} className="mx-2 p-4 bg-black text-white rounded-lg hover:underline hover:bg-gray-500">
            Collares
            </Link>
            <Link href={""} className="mx-2 p-4 bg-black text-white rounded-lg hover:underline hover:bg-gray-500">
            Portachupón
            </Link>
            <Link href={""} className="mx-2 p-4 bg-black text-white rounded-lg hover:underline hover:bg-gray-500">
            Portamordedor
            </Link>
            <Link href={""} className="mx-2 p-4 bg-black text-white rounded-lg hover:underline hover:bg-gray-500">
            Contacto
            </Link>
        </div>
      </div>
    </nav>
  );
};
