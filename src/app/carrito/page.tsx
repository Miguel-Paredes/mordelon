"use client";
import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import Image from "next/image";
import * as z from "zod";
import { useUser } from "../hooks/us-user";
import Router from "next/router";
import { addDocument } from "@/lib/firebase";
import toast from "react-hot-toast";
import { serverTimestamp } from "firebase/firestore";

interface CartItem {
  nombre: string;
  cantidad: number;
  precio: number;
  imagen: string;
  quantity: number;
  babyInitial?: string | null;
  nombre_bebe: string;
  direccion: string;
  selectedImages?: string[];
  estado: "En revisión" | "Pagado";
}

export default function CartPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Estado para controlar el modal
  const [formData, setFormData] = useState<{
    nombre_bebe: string;
    direccion: string;
  }>({
    nombre_bebe: "",
    direccion: "",
  });
  const user = useUser();
  const router = Router;

  // Esquema de validación del formulario
  const formSchema = z.object({
    name: z.array(z.string()),
    image: z.array(z.string()),
    selectedImages: z.array(z.string()).default([]),
    cantidad: z.array(z.number()),
    price: z.array(z.number()),
    total: z.number(),
    babyInitial: z.array(z.string()),
    nombre_bebe: z.string().min(3, "El nombre del bebé es requerido"),
    direccion: z.string().min(10, "La dirección es requerida"),
  });

  // Estado para almacenar los productos del carrito
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Función para cargar los productos del localStorage al estado
  const loadCartItems = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = storedCart.map((item: CartItem) => ({
      ...item,
      selectedImages: Array.isArray(item.selectedImages) ? item.selectedImages : [], // Asegúrate de que sea un array
    }));
    setCartItems(updatedCart);
  };

  // Cargar los productos del carrito cuando se monta el componente
  useEffect(() => {
    loadCartItems();
  }, []);

  // Función para calcular el total del carrito
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.precio * item.quantity,
      0
    );
  };

  // Función para eliminar un producto del carrito
  const removeFromCart = (index: number) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Función para manejar el envío del formulario
  const onSubmit = async () => {
    let pedido_realizado = false
    if (!user) {
      toast.error("Debes iniciar sesión para realizar un pedido.");
      return router.push("/auth");
    }

    setIsLoading(true);
    try {
      // Validar los datos del formulario
      const validatedData = formSchema.parse({
        name: cartItems.map((item) => item.nombre),
        image: cartItems.map((item) => item.imagen),
        selectedImages: cartItems.flatMap((item) => item.selectedImages || []),
        cantidad: cartItems.map((item) => item.quantity),
        price: cartItems.map((item) => item.precio),
        babyInitial: cartItems.map((item) => item.babyInitial || ""),
        total: calculateTotal(),
        nombre_bebe: formData.nombre_bebe,
        direccion: formData.direccion,
      });
      // Crear el pedido en Firebase
      const pedidoCliente = await addDocument(`users/${user.uid}/pedidos`, {
        ...validatedData,
        createdAt: serverTimestamp(),
        estado: "En revisión"
      });
      await addDocument(`pedidos`, {
        ...validatedData,
        createdAt: serverTimestamp(),
        phone: user.phone,
        cliente: user.name,
        estado: "En revisión",
        idcliente: user.uid,
        idpedido: pedidoCliente.id
      });
      pedido_realizado = true

      // Limpiar el carrito del localStorage
      localStorage.removeItem("cart");
      localStorage.removeItem("pedidos");
      localStorage.removeItem("admin");
      setCartItems([]); // También limpiamos el estado local
      setIsLoading(false);
      setIsModalOpen(false); // Cerrar el modal después de enviar
    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error al realizar el pedido.", {
        duration: 5000,
      });
      setIsLoading(false);
    }finally{
      if(pedido_realizado) return toast.success("Pedido realizado exitosamente", { duration: 5000 });
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Carrito de Compras
        </h1>

        {/* Mostrar mensaje si el carrito está vacío */}
        {cartItems.length === 0 ? (
          <div className="flex justify-center items-center">
            <p className="text-center text-gray-600">El carrito está vacío.</p>
          </div>
        ) : (
          <div>
            {/* Mostrar el total del carrito */}
            <div className="flex justify-end mt-4 mb-2">
              <p className="text-xl font-bold text-gray-800">
                Total: ${calculateTotal()}
              </p>
            </div>

            {/* Lista de productos en el carrito */}
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-100 shadow-md rounded-lg p-4 mb-4"
              >
                {/* Imagen del producto */}
                <div className="w-20 h-20 relative rounded-full overflow-hidden">
                  <Image
                    src={item.imagen}
                    alt={item.nombre}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>

                {/* Detalles del producto */}
                <div className="flex-1 ml-4">
                  <div className="flex justify-start">
                    <h3 className="text-lg font-semibold mr-4">
                      {item.nombre}                    
                    </h3>
                    {item.nombre.includes("diseños a elección") && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="flex justify-center">
                            <Button variant="outline">Ver</Button>
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
                              {item.selectedImages && item.selectedImages.map((imagen, index) => (
                                <Image
                                  key={index}
                                  src={imagen}
                                  alt={"Imágen clip"}
                                  width={1000}
                                  height={1000}
                                  className="h-16 w-16 rounded-full border-2 border-gray-200"
                                />
                              ))}
                            </div>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <p className="text-gray-600">Precio: ${item.precio}</p>
                  <p className="text-gray-600">Cantidad: {item.quantity}</p>
                  {item.babyInitial && (
                    <p className="text-gray-600">
                      Inicial del bebé: {item.babyInitial}
                    </p>
                  )}
                  <p className="text-lg font-bold text-blue-600">
                    Total: ${item.precio * item.quantity}
                  </p>
                </div>

                {/* Botón para eliminar el producto */}
                <Button
                  onClick={() => removeFromCart(index)}
                  className="bg-red-500 text-white hover:bg-red-600 ml-4"
                >
                  Eliminar
                </Button>
              </div>
            ))}

            {/* Botón para abrir el modal */}
            <div className="mx-2 flex justify-end">
              <Button
                className="bg-[#6edad2] text-[#09282a] hover:bg-[#3dbdb8]"
                onClick={() => setIsModalOpen(true)} // Abrir el modal
              >
                {isLoading ? "Procesando..." : "Realizar Pedido"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Datos del Pedido</h2>

            {/* Formulario dentro del modal */}
            <form onSubmit={(e) => {
              e.preventDefault()
              onSubmit()
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre del Bebé
                </label>
                <input
                  type="text"
                  value={formData.nombre_bebe}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nombre_bebe: e.target.value.toUpperCase(),
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Juan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      direccion: e.target.value.toUpperCase(),
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Av. Pedro Vicente Maldonado S11-122, Quito 170111"
                />
              </div>

              {/* Botones del modal */}
              <div className="flex justify-end space-x-2">
                <Button
                  className="bg-gray-300 text-gray-700 hover:bg-gray-400"
                  onClick={() => setIsModalOpen(false)} // Cerrar el modal
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-[#6edad2] text-[#09282a] hover:bg-[#3dbdb8]"
                >
                  Confirmar Pedido
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}