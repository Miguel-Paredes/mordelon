import { chupon } from "@/seed";
import { CardProducts } from "./card-products/card";

export default function Portachupon() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-center mb-10">
        Portachupones
      </h2>
      <div>
        <CardProducts productos={chupon} />
      </div>
    </div>
  );
}
