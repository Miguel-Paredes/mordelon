"use client";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { getColection } from "@/lib/firebase";
import { orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "../hooks/us-user";
import Image from "next/image";
import { Pedidos_Administrador } from "@/interfaces/administrador.interface";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export default function PedidosDesktop() {
  const user = useUser();
  const [pedidos, setPedidos] = useState<Pedidos_Administrador[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        // Verificar si los datos ya están en localStorage
        const storedPedidos = localStorage.getItem("admin");
        if (storedPedidos) {
          const parsedPedidos = JSON.parse(storedPedidos); // Convertir de string a objeto
          setPedidos(parsedPedidos);
          console.log(storedPedidos);
          setLoading(false);
          return;
        } else {
          localStorage.removeItem("admin");
        }

        // Si no están en localStorage, obtenerlos de Firebase
        const path = `pedidos`;
        const query = [orderBy("createdAt", "desc")];
        const pedidosData = await getColection(path, query);

        // Guardar los datos en localStorage
        localStorage.setItem("admin", JSON.stringify(pedidosData));
        setPedidos(pedidosData as Pedidos_Administrador[]);
      } catch (error: any) {
        toast.error(error.message || "Error al cargar los pedidos", {
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [user]);

  // Función para convertir la fecha de Firebase a un objeto Date
  const convertirAFecha = (seconds: number, nanoseconds: number): Date => {
    const tiempoEnMilisegundos = seconds * 1000 + nanoseconds / 1000000;
    return new Date(tiempoEnMilisegundos);
  };

  // Función para formatear la fecha en un formato legible
  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString("es-ES", {
      weekday: "short", // Día de la semana en formato corto (ej. "lun.")
      year: "numeric", // Año completo (ej. "2025")
      month: "short", // Mes en formato corto (ej. "feb.")
      day: "numeric", // Día del mes (ej. "13")
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Pedidos</h1>
      {pedidos.length > 0 ? (
        <div className="w-full">
          {pedidos.map((pedido, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden shadow-lg py-2 my-4 bg-gray-100"
            >
              <div className="mx-4">
                <div className="flex justify-between">
                  <b>Fecha:</b>
                  <span>
                    {formatearFecha(
                      convertirAFecha(
                        pedido.createdAt.seconds,
                        pedido.createdAt.nanoseconds
                      )
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <b>Total:</b>
                  <span>${pedido.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <b>Nombre del bebé:</b>
                  <span>{pedido.nombre_bebe}</span>
                </div>
                <div className="flex justify-between">
                  <b>Dirección:</b>
                  <span>{pedido.direccion}</span>
                </div>
                <div>
                  <b>Descripción:</b>
                  {pedido.name.map((nombre, idx) => (
                    <p key={idx} className="pt-1">
                      - {nombre}
                      <span>
                        <b>{" " + pedido.babyInitial[idx]}</b>
                      </span>
                    </p>
                  ))}
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <Link href={`https://wa.me/${pedido.phone}`}>
                    <Button className="bg-green-500">
                      <FaWhatsapp size={30} />
                    </Button>
                  </Link>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Ver pedido</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <div className="flex justify-center">
                          <DialogTitle>Detalles del Pedido</DialogTitle>
                        </div>
                        <div className="flex justify-end">
                          <p className="p-2 my-2 border-2 border-solid border-gray-200 rounded-lg w-max">
                            Total: ${pedido.total.toFixed(2)}
                          </p>
                        </div>
                      </DialogHeader>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Precio Unitario</TableHead>
                            <TableHead>Imagen</TableHead>
                            <TableHead>SubTotal</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pedido.name.map((nombre, idx) => (
                            <TableRow key={idx}>
                              <TableCell>
                                {nombre}
                                <span>
                                  <b>{" " + pedido.babyInitial[idx]}</b>
                                </span>
                              </TableCell>
                              <TableCell className="text-center">
                                {pedido.cantidad[idx]}
                              </TableCell>
                              <TableCell>
                                ${pedido.price[idx].toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <Image
                                  src={pedido.image[idx]}
                                  alt={nombre}
                                  width={50}
                                  height={50}
                                  className="rounded-md"
                                />
                              </TableCell>
                              <TableCell>
                                $
                                {(
                                  pedido.price[idx] * pedido.cantidad[idx]
                                ).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <p className="text-center text-gray-600">
            No existen pedidos previos.
          </p>
        </div>
      )}
    </div>
  );
}