import { AiOutlineShoppingCart } from "react-icons/ai";
import Link from "next/link";
import { CardProducts } from "@/components/ui";
import { collares } from "@/seed";

export default function Collares() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-center mb-10">
        Collares de Lactancia
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <CardProducts productos={collares} />
        {/* <Link
          href={``}
          className="flex justify-center w-full text-center rounded-lg px-4 py-2 text-white bg-cyan-700 hover:bg-cyan-600 hover:shadow-xl"
        >
          Agregar al carrito
          <AiOutlineShoppingCart size={30} className="ml-2" />
        </Link> */}
      </div>
    </div>
  );
}
