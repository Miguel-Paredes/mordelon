import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-gray-800 mt-10 text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} Pequeño Mordelón. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};
