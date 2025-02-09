"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import Image from "next/image";

interface CartItem {
  nombre: string;
  precio: number;
  imagen: string;
  quantity: number;
  babyInitial?: string | null;
}

export default function CartPage() {
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

  return (
    <>
      <div className={`container mx-auto p-4`}>
        <h1 className="text-3xl font-bold text-center mb-8">
          Carrito de Compras
        </h1>

        {/* Lista de productos en el carrito */}
        {cartItems.length === 0 ? (
          <div className="h-80 flex justify-center items-center">
            <p className="text-center text-gray-600">El carrito está vacío.</p>
          </div>
        ) : (
          <div className={`${cartItems.length < 2 ? "h-80" : "h-auto"}`}>
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
                  {/* Precio total por producto */}
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

            {/* Total del carrito */}
            <div className="flex justify-end mt-4">
              <p className="text-xl font-bold text-gray-800">
                Total: ${calculateTotal()}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
