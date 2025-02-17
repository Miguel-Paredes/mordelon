import Image from "next/image";
import { Metadata } from "next";
import SignUp from "./components/sign-up";

export const metadata: Metadata = {
  title: "Crear Cuenta",
  description: "Crear una nueva Cuenta",
};

export default function Page() {
  return (
    <>
      <div className="flex justify-center items-center md:h-[95vh] md:px-10 lg:px-26">
        <div className="container h-[85vh] flex-col justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          {/* Formulario */}
          <div className="pt-10 lg:p-8 flex items-center md:h-[70vh] ">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
              <SignUp/>
            </div>
          </div>
          {/* Imagen */}
          <div className="relative hidden max-h-screen flex-col px-10 text-white lg:flex">
            <Image
              src={"/registro.png"}
              alt="Imagen de Registro"
              width={1000}
              height={1000}
              className="absolute inset-0 h-full w-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
}
