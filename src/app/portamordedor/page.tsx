import { CardProducts } from "./card-products/card";
import { ProductosAmigables } from "@/components/ui";

export default function Portamordedor() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-center mb-5">
        Portamordedor
      </h2>
      <ProductosAmigables />
      <CardProducts/>
    </main>
  );
}
