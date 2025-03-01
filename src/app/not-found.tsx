"use client";
import { Footer, Navbar } from "@/components/ui";
import { titleFont } from "@/config/font";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-col-reverse md:flex-row justify-center items-center m-auto">
        <div className="text-center max-w-sm">
          <h2 className={`${titleFont.className} antialiased text-9xl`}>404</h2>
          <p className="font-semibold text-xl">
            Whoops! Lo sentimos mucho. Página no encontrada.
          </p>
          <p className="font-light">
            <span>Puedes regresar al </span>
            <Link
              href="/"
              className="font-normal text-muted-foreground hover:underline transition-all"
            >
              Inicio
            </Link>
          </p>
        </div>
        <div>
          <Image
            src="/PageNotFound.png"
            alt="Página no encontrada"
            className="p-5 sm:p-0 object-cover max-w-sm"
            width={1000}
            height={1000}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
