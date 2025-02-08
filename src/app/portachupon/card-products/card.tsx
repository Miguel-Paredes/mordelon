import { Button } from "@/components/ui";
import { Productos } from "@/interfaces/productos.interface";
import Image from "next/image";
import { AiOutlineShoppingCart } from "react-icons/ai";

interface CardProductsProps {
  productos: Productos[];
}

export const CardProducts = ({ productos }: CardProductsProps) => {
  return (
    <div className="flex flex-wrap w-full gap-8 justify-center pt-4">
      {productos.map((products, index) => (
        <div
          key={index}
          className="bg-white md:max-w-md lg:max-w-sm rounded-t-3xl overflow-hidden shadow-lg"
        >
          <Image
            src={products.imagen}
            alt={products.nombre}
            width={1000}
            height={1000}
            className="w-full h-52 object-cover rounded-full"
          />
          <div className="p-4">
            <h3 className="text-lg text-center">{products.nombre}</h3>
            <p className="text-blue-600 font-bold mt-4 text-center">
              <span className="text-gray-600 font-semibold">Costo: </span>$
              {products.precio}
            </p>
          </div>
          <div className="flex justify-center">
            <Button className="text-center hover:underline bg-cyan-300 text-black hover:bg-cyan-400">
              Añadir al carrito
              <AiOutlineShoppingCart />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
