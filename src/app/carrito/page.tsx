"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
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
}

export default function CartPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = useUser();
  const router = Router;

  // Esquema de validación del formulario
  const formSchema = z.object({
    name: z.array(z.string()),
    image: z.array(z.string()),
    cantidad: z.array(z.number()),
    price: z.array(z.number()),
    total: z.number(),
  });

  // Estado para almacenar los productos del carrito
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Función para cargar los productos del localStorage al estado
  const loadCartItems = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);
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
    if (!user) {
      toast.error("Debes iniciar sesión para realizar un pedido.");
      return router.push("/auth");
    }

    setIsLoading(true);

    try {
      // Mapear los datos del carrito al formato requerido por el formulario
      const pedidos = {
        name: cartItems.map((item) => item.nombre),
        image: cartItems.map((item) => item.imagen),
        cantidad: cartItems.map((item)=> item.cantidad),
        price: cartItems.map((item) => item.precio),
        total: calculateTotal(),
      };

      // Validar los datos del formulario
      const validatedData = formSchema.parse(pedidos);

      // Crear el pedido en Firebase
      await addDocument(`users/${user.uid}/pedidos`, {
        ...validatedData,
        createdAt: serverTimestamp(),
      });

      await addDocument(`pedidos`, {
        ...validatedData,
        createdAt: serverTimestamp(),
      });

      toast.success("Pedido realizado exitosamente");

      // Limpiar el carrito del localStorage
      localStorage.removeItem("cart");
      setCartItems([]); // También limpiamos el estado local
      setIsLoading(false);
    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error al realizar el pedido.", {
        duration: 5000,
      });
      setIsLoading(false);
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
          <div className="h-80 flex justify-center items-center">
            <p className="text-center text-gray-600">El carrito está vacío.</p>
          </div>
        ) : (
          <div className={`${cartItems.length < 2 ? "h-80" : "h-auto"}`}>
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
                  <h3 className="text-lg font-semibold">{item.nombre}</h3>
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

            {/* Botón para realizar el pedido */}
            <div className="mx-2 flex justify-end">
              <Button
                className="bg-[#6edad2] text-[#09282a] hover:bg-[#3dbdb8]"
                onClick={onSubmit} // Llamamos directamente a onSubmit
              >
                {isLoading ? "Procesando..." : "Realizar Pedido"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
