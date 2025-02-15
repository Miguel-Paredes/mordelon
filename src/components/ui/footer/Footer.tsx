import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 grid grid-cols-1 md:grid-cols-2">
      <div className="container mx-auto px-4 text-center order-2 md:order-1">
        <p>
          &copy; {new Date().getFullYear()} Pequeño Mordelón. Todos los derechos
          reservados.
        </p>
      </div>
      <div className="flex justify-center order-1 md:order-2">
        <div className="mx-4">
          <Link
            href={"https://wa.me/0960667241"}
            className="flex justify-center hover:underline"
          >
            <FaWhatsapp size={25} className="whatsapp-icon" />
            <span className="mx-1 text-white">WhatsApp</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};
