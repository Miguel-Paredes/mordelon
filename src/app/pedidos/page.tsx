"use client";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { Pedidos_Usarios } from "@/interfaces/pedidos.interface";
import { getColection } from "@/lib/firebase";
import { orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "../hooks/us-user";
import Image from "next/image";

export default function Pedidos() {
  const user = useUser();
  const [pedidos, setPedidos] = useState<Pedidos_Usarios[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPedido, setSelectedPedido] = useState<Pedidos_Usarios | null>(
    null
  );

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        // Verificar si los datos ya están en localStorage
        const storedPedidos = localStorage.getItem("pedidos");
        if (storedPedidos) {
          const parsedPedidos = JSON.parse(storedPedidos); // Convertir de string a objeto
          setPedidos(parsedPedidos);
          console.log(storedPedidos)
          setLoading(false);
          return;
        }

        // Si no están en localStorage, obtenerlos de Firebase
        const id_usuario = user?.uid;
        const path = `users/${id_usuario}/pedidos/`;
        const query = [orderBy("createdAt", "desc")];
        const pedidosData = await getColection(path, query);

        // Guardar los datos en localStorage
        localStorage.setItem("pedidos", JSON.stringify(pedidosData));
        setPedidos(pedidosData as Pedidos_Usarios[]);
      } catch (error: any) {
        setError(error.message || "Error al cargar los pedidos");
        toast.error(error.message || "Error al cargar los pedidos", {
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Pedidos</h1>
      {pedidos.length > 0 ? (
        <div className={`${pedidos.length < 6 ? "h-80" : "h-auto"}`}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N°</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            {pedidos.map((pedido, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>${pedido.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Ver pedido</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Detalles del Pedido</DialogTitle>
                      </DialogHeader>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Subtotal</TableHead>
                            <TableHead>Imagen</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <tbody>
                          {pedido.name.map((nombre, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{nombre}</TableCell>
                              <TableCell>${pedido.price[idx].toFixed(2)}</TableCell>
                              <TableCell>
                                <Image
                                  src={pedido.image[idx]}
                                  alt={nombre}
                                  width={50}
                                  height={50}
                                  className="rounded-md"
                                />
                              </TableCell>
                              <TableCell>${pedido.price[idx].toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </tbody>
                      </Table>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </div>
      ) : (
        <div className="h-80 flex justify-center items-center">
          <p className="text-center text-gray-600">
            No existen pedidos previos.
          </p>
        </div>
      )}
    </div>
  );
}