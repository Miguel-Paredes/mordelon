import Image from "next/image";
import Link from "next/link";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  imagen: string;
  url: string
}

export const Cards = () => {
  const productos: Producto[] = [
    {
      id: 1,
      nombre: "Collares de lactancia",
      descripcion:
        "Favorecen la estimulación y el desarrollo sensorial de tu bebé.",
      precio: "$10.00",
      imagen: "/collares-mordedores.jpg",
      url: 'collares-de-lactancia'
    },
    {
      id: 2,
      nombre: "Portachupón",
      descripcion:
        "Mantén el chupón limpio y siempre a mano, favoreciendo la comodidad de tu bebé.",
      precio: "$15.00",
      imagen: "/portachupón.png",
      url: 'portachupón'
    },
    {
      id: 3,
      nombre: "Portamordedor",
      descripcion:
        "Perfecto para aliviar las molestias de la dentición, fácil de llevar y evitar que se pierda.",
      precio: "$20.00",
      imagen: "/portamordedor.png",
      url: 'portamordedor'
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {productos.map((producto) => (
        <div
          key={producto.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            width={1000}
            height={1000}
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold text-center">
              {producto.nombre}
            </h3>
            <p className="text-gray-600 mt-2">{producto.descripcion}</p>
            <p className="text-blue-600 font-bold mt-4">
              <span className="text-gray-600 font-semibold">Desde los: </span>
              {producto.precio}
            </p>
          </div>
          <div className="flex justify-center mb-2">
            <Link
              href={`/${producto.url}`}
              className="w-max rounded-lg px-4 py-2 bg-blue-400 hover:bg-blue-300 hover:underline"
            >
              Ver más
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
