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

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        // Verificar si los datos ya están en localStorage
        const storedPedidos = localStorage.getItem("pedidos");
        if (storedPedidos && storedPedidos?.length > 2) {
          const parsedPedidos = JSON.parse(storedPedidos); // Convertir de string a objeto
          setPedidos(parsedPedidos);
          console.log(storedPedidos.length);
          setLoading(false);
          return;
        } else {
          localStorage.removeItem("pedidos");
          console.log("No hay pedidos almacenados o están vacíos.");
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
        <div className="flex justify-center">
          <div className={`w-full md:w-3/4`}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <p className="hidden md:block">N°</p>
                  </TableHead>
                  <TableHead>
                    <p className="text-center">Descripción</p>
                  </TableHead>
                  <TableHead>
                    <p className="text-center">Fecha</p>
                  </TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>
                    <p className="text-center">Acciones</p>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.map((pedido, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <p className="hidden md:block">{index + 1}</p>
                    </TableCell>
                    <TableCell>
                      {pedido.name.slice(0, 2).map((nombre, idx) => (
                        <p key={idx}>
                          {nombre}
                          <span>
                            <b>{" " + pedido.babyInitial[idx]}</b>
                          </span>
                        </p>
                      ))}
                      {pedido.name.length > 2 && <p>...</p>}
                    </TableCell>
                    <TableCell>
                      {/* Mostrar la fecha formateada */}
                      <span className="flex justify-center">
                        {formatearFecha(
                          convertirAFecha(
                            pedido.createdAt.seconds,
                            pedido.createdAt.nanoseconds
                          )
                        )}
                      </span>
                    </TableCell>
                    <TableCell>${pedido.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="flex justify-center">
                            <Button variant="outline">Ver pedido</Button>
                          </div>
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
                                  <TableCell>{nombre}</TableCell>
                                  <TableCell className="text-center">
                                    {pedido.cantidad[idx]}
                                  </TableCell>
                                  <TableCell>
                                    ${pedido.price[idx].toFixed(2)}
                                  </TableCell>
                                  <TableCell>
                                    {pedido.name[idx].includes(
                                      "diseños a elección"
                                    ) ? (
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <div className="flex justify-center">
                                            <Button variant="outline">
                                              Ver
                                            </Button>
                                          </div>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>
                                              <p className="text-center">
                                                Clips elegidos
                                              </p>
                                            </DialogTitle>
                                            <div className="flex justify-center space-x-2">
                                              {pedido.selectedImages &&
                                                pedido.selectedImages.map(
                                                  (imagen, index) => (
                                                    <Image
                                                      key={index}
                                                      src={imagen}
                                                      alt={"Imágen clip"}
                                                      width={1000}
                                                      height={1000}
                                                      className="h-16 w-16 rounded-full border-2 border-gray-200"
                                                    />
                                                  )
                                                )}
                                            </div>
                                          </DialogHeader>
                                        </DialogContent>
                                      </Dialog>
                                    ) : (
                                      <Image
                                        src={pedido.image[idx]}
                                        alt={nombre}
                                        width={50}
                                        height={50}
                                        className="rounded-md"
                                      />
                                    )}
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
