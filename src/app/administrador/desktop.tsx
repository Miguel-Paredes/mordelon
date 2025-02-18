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
import { getColection, updateDocument } from "@/lib/firebase";
import { orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "../hooks/us-user";
import Image from "next/image";
import { Pedidos_Administrador } from "@/interfaces/administrador.interface";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

export default function PedidosDesktop() {
  const user = useUser();
  const [pedidos, setPedidos] = useState<Pedidos_Administrador[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<string>("todos"); // Filtro por estado
  const [filtroFecha, setFiltroFecha] = useState<string>("todas"); // Estado para almacenar la fecha seleccionada
  const [filtroNombreBebe, setFiltroNombreBebe] = useState<string>(""); // Filtro por nombre del bebé

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        // Verificar si el usuario es el administrador
        const isAdmin = user?.uid === process.env.NEXT_PUBLIC_ID_ADMINISTRADOR;
        if (!isAdmin) {
          // Si no es administrador, establecer un array vacío
          setPedidos([]);
          setLoading(false);
          return;
        }
        // Si no están en localStorage, obtenerlos de Firebase
        const path = `pedidos`;
        const query = [orderBy("createdAt", "desc")];
        const pedidosData = await getColection(path, query);

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

  // Obtener fechas únicas de los pedidos
  const fechasUnicas = Array.from(
    new Set(
      pedidos.map((pedido) =>
        formatearFecha(
          convertirAFecha(
            pedido.createdAt.seconds,
            pedido.createdAt.nanoseconds
          )
        )
      )
    )
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // Ordenar de más reciente a más antiguo

  // Filtrar los pedidos según los filtros aplicados
  const pedidosFiltrados = pedidos.filter((pedido) => {
    const fechaPedido = formatearFecha(
      convertirAFecha(pedido.createdAt.seconds, pedido.createdAt.nanoseconds)
    );

    // Aplicar filtro de estado
    const cumpleFiltroEstado =
      filtroEstado === "todos" || pedido.estado === filtroEstado;

    // Aplicar filtro de fecha
    const cumpleFiltroFecha =
      filtroFecha === "todas" || fechaPedido === filtroFecha;

    // Aplicar filtro de nombre del bebé (ignorando mayúsculas/minúsculas)
    const cumpleFiltroNombreBebe =
      filtroNombreBebe.trim() === "" ||
      pedido.nombre_bebe.toLowerCase().includes(filtroNombreBebe.toLowerCase());

    return cumpleFiltroEstado && cumpleFiltroFecha && cumpleFiltroNombreBebe;
  });

  const cambiarEstado = async (idPedidoAdministrador: string, idCliente: string, idPedidoCliente: string) => {
    const pathAdministrador = `pedidos`;
    const pathCliente = `users/${idCliente}/pedidos`;
  
    try {
      await updateDocument(pathAdministrador, idPedidoAdministrador);
      await updateDocument(pathCliente, idPedidoCliente);

      // Volver a cargar los datos actualizados desde Firebase
      const path = `pedidos`;
      const query = [orderBy("createdAt", "desc")];
      const pedidosData = await getColection(path, query);
  
      // Actualizar el estado local con los nuevos datos
      setPedidos(pedidosData as Pedidos_Administrador[]);
    } catch (error) {
      toast.error("Error al actualizar el estado del pedido");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Pedidos</h1>
      <div className="w-full flex justify-between space-x-2">
        {/* Selector de filtro por estado */}
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="m-2 p-2 rounded-lg"
        >
          <option value="todos">Todos los estados</option>
          <option value="Pagado">Pagado</option>
          <option value="En revisión">En revisión</option>
        </select>
        {/* Selector de filtro por fecha */}
        <select
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
          className="m-2 p-2 rounded-lg"
        >
          <option value="todas">Todas las fechas</option>
          {fechasUnicas.map((fecha, index) => (
            <option key={index} value={fecha}>
              {fecha}
            </option>
          ))}
        </select>
        {/* Selector de filtro por nombre del bebe */}
        <input
          type="text"
          placeholder="Buscar por nombre del bebé..."
          value={filtroNombreBebe}
          onChange={(e) => setFiltroNombreBebe(e.target.value.toUpperCase())}
          className="w-full border-2 border-gray-200 m-2 p-2 rounded-lg"
        />
      </div>

      {pedidosFiltrados.length > 0 ? (
        <div className="flex justify-center">
          <div className="w-full">
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
                  <TableHead>
                    <p className="text-center">Dirección</p>
                  </TableHead>
                  <TableHead>
                    <p className="text-center">Nombre del bebé</p>
                  </TableHead>
                  <TableHead>
                    <p className="text-center">Total</p>
                  </TableHead>
                  <TableHead>
                    <p className="text-center">Estado</p>
                  </TableHead>
                  <TableHead>
                    <p className="text-center">Acciones</p>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidosFiltrados.map((pedido, index) => (
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
                    <TableCell>
                      <p className="text-center">{pedido.direccion}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-center">{pedido.nombre_bebe}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-center">${pedido.total.toFixed(2)}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-center">{pedido.estado}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-2">
                        <Link href={`https://wa.me/${pedido.phone}`}>
                          <Button className="bg-green-500">
                            <FaWhatsapp size={30} />
                          </Button>
                        </Link>
                        {pedido.estado === "En revisión" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="bg-red-400 hover:bg-red-300" variant="outline">Pagado</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <div className="text-center">
                                  <DialogTitle>Va a confirmar el pago del cliente</DialogTitle>
                                </div>
                              </DialogHeader>
                              <Button className="bg-green-400" onClick={()=>cambiarEstado(pedido.id, pedido.idcliente, pedido.idpedido)}>Pagado</Button>
                            </DialogContent>
                          </Dialog>
                        )}
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
                      </div>
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
