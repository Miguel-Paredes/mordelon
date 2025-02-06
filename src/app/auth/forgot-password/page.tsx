import Image from "next/image";
import { Metadata } from "next";
import RecoverPassword from "./components/recover-password";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  description: "Reestablecer la contraseña de un usuario",
};

export default function ForgotPassword() {
  return (
    <div className="flex justify-center items-center md:h-screen">
      <div className="pt-10 lg:p-8 flex items-center md:h-[70vh] ">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
          <RecoverPassword />
        </div>
      </div>
    </div>
  );
}
