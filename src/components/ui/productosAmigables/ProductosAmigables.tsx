import Image from "next/image";

export const ProductosAmigables = () => {
  const imagenesProductos = [
    {
      image: "/ProductosAmigables/estimulacion.png",
      nombre: "Estimulación",
    },
    {
      image: "/ProductosAmigables/no-toxico.png",
      nombre: "No Toxico",
    },
    {
      image: "/ProductosAmigables/producto.png",
      nombre: "Producto 100% lavable",
    },
    {
      image: "/ProductosAmigables/silicon.png",
      nombre: "Silicón de Grado Alimenticio",
    },
  ];
  return (
    <div className="flex flex-wrap justify-center space-x-3 border-2 border-cyan-200 rounded-xl max-w-xl mx-auto p-2">
      {imagenesProductos.map((imagen, index) => (
        <Image
          key={index}
          alt={imagen.nombre}
          src={imagen.image}
          width={1000}
          height={1000}
          className="w-max h-24 object-cover"
        />
      ))}
    </div>
  );
}
