import { Cards } from "@/components/ui";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-center mb-10">
        Catálogo de Productos
      </h2>
      <Cards />
    </main>
  );
}
