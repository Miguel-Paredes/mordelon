import { mordedores } from "@/seed/mordedores.seed";
import { CardProducts } from "./card-products/card";

export default function Portamordedor() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-center mb-10">
        Portamordedor
      </h2>
      <CardProducts productos={mordedores}/>
    </main>
  );
}
