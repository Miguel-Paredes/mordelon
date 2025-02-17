import type { Metadata } from "next";
import Image from "next/image";
import SignIn from "./components/sign-in";

export const metadata: Metadata = {
  title: "Login",
  description: "Acceso a su cuenta",
};

export default function Page() {
  return (
    <>
      <div className="flex justify-center items-center md:h-[95vh] md:px-10 lg:px-26">
        <div className="container h-[85vh] flex-col justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          {/* Imagen */}
          <div className="relative hidden max-h-screen flex-col px-10 text-white lg:flex">
            <Image
              src={"/login.jpeg"}
              alt="Imagen de login"
              width={1000}
              height={1000}
              className="absolute inset-0 h-full w-full rounded-lg"
            />
          </div>
          {/* Formulario */}
          <div className="pt-10 lg:p-8 flex items-center md:h-[70vh] ">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
              <SignIn />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
