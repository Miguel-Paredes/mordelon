import { chupon } from "@/seed";
import { CardProducts } from "./card-products/card";
import { ProductosAmigables } from "@/components/ui";

export default function Portachupon() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-center mb-5">Portachupones</h2>
      <ProductosAmigables />
      <div>
        <CardProducts productos={chupon} />
      </div>
    </div>
  );
}
