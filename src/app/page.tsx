import { Cards } from "@/components/ui";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-semibold text-center mb-8">
        Catálogo de Productos
      </h2>
      <Cards />
    </main>
  );
}
