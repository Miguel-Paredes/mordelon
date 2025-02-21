import Link from "next/link";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

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
        <div className="mx-4 mb-4 md:mb-0 flex justify-center space-x-2">
          <Link
            href={"https://wa.me/+593960667241"}
            className="flex justify-center hover:underline"
          >
            <FaWhatsapp size={25} className="whatsapp-icon" />
            <span className="mx-1 text-white hidden md:block">WhatsApp</span>
          </Link>
          <Link
            href={"https://www.facebook.com/share/1AHNeR7tNa/"}
            className="flex justify-center hover:underline"
          >
            <FaFacebook size={25} className="facebook-icon" />
            <span className="mx-1 text-white hidden md:block">Facebook</span>
          </Link>
          <Link
            href={"https://www.instagram.com/pequeno.mordelon?igsh=dHBqNWh6YWJwcDN3"}
            className="flex justify-center hover:underline"
          >
            <FaInstagram size={25} className="instagram-icon" />
            <span className="mx-1 text-white hidden md:block">Instagram</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};
