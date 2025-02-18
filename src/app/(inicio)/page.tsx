import { Cards, ProductosAmigables } from "@/components/ui";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-center mb-5">
        Catálogo de Productos
      </h2>
      <ProductosAmigables/>
      <Cards />
    </div>
  );
}
