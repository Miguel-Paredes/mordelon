"use client";
import { useState } from "react";
import { Button } from "@/components/ui";
import { Productos } from "@/interfaces/productos.interface";
import Image from "next/image";
import { AiOutlineShoppingCart, AiOutlineDelete } from "react-icons/ai";

interface CardProductsProps {
  productos: Productos[];
}

export const CardProducts = ({ productos }: CardProductsProps) => {
  // Estado para controlar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Estado para almacenar el producto seleccionado
  const [selectedProduct, setSelectedProduct] = useState<Productos | null>(
    null
  );
  // Estado para la cantidad
  const [quantity, setQuantity] = useState(1);
  // Estado para la inicial del bebé
  const [babyInitial, setBabyInitial] = useState("");
  // Estado para verificar si el producto ya está en el carrito
  const [isInCart, setIsInCart] = useState(false);

  // Función para abrir el modal y seleccionar el producto
  const handleAddToCart = (product: Productos) => {
    setSelectedProduct(product);

    // Verificar si el producto ya está en el carrito
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingProduct = currentCart.find(
      (item: any) => item.nombre === product.nombre
    );

    if (existingProduct) {
      setIsInCart(true); // El producto ya está en el carrito
      setQuantity(existingProduct.quantity); // Cargar la cantidad previamente ingresada
      setBabyInitial(existingProduct.babyInitial || ""); // Cargar la inicial del bebé si existe
    } else {
      setIsInCart(false); // El producto no está en el carrito
      setQuantity(1); // Reiniciar la cantidad
      setBabyInitial(""); // Reiniciar la inicial del bebé
    }

    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setIsInCart(false);
  };

  // Función para agregar o actualizar el producto en el localStorage
  const updateLocalStorage = () => {
    if (selectedProduct) {
      // Obtener el carrito actual del localStorage
      const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");

      // Crear un objeto con la información del producto, cantidad e inicial del bebé
      const productToUpdate = {
        ...selectedProduct,
        quantity,
        babyInitial: selectedProduct.nombre.includes("inicial")
          ? babyInitial
          : null,
      };

      // Actualizar el carrito
      const updatedCart = isInCart
        ? currentCart.map((item: any) =>
            item.nombre === selectedProduct.nombre ? productToUpdate : item
          )
        : [...currentCart, productToUpdate];

      // Guardar el carrito actualizado en el localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      alert(
        isInCart
          ? "Producto actualizado en el carrito!"
          : "Producto añadido al carrito!"
      );
      closeModal();
    }
  };

  // Función para eliminar el producto del localStorage
  const removeFromLocalStorage = () => {
    if (selectedProduct) {
      // Obtener el carrito actual del localStorage
      const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");

      // Filtrar el carrito para eliminar el producto
      const updatedCart = currentCart.filter(
        (item: any) => item.nombre !== selectedProduct.nombre
      );

      // Guardar el carrito actualizado en el localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      alert("Producto eliminado del carrito!");
      closeModal();
    }
  };

  return (
    <div>
      {/* Lista de productos */}
      <div className="flex flex-wrap w-full gap-8 justify-center pt-4">
        {productos.map((product, index) => {
          // Verificar si el producto ya está en el carrito
          const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
          const existingProduct = currentCart.find(
            (item: any) => item.nombre === product.nombre
          );
          const isAlreadyInCart = !!existingProduct;

          return (
            <div
              key={index}
              className="bg-white md:max-w-md lg:max-w-sm rounded-t-3xl overflow-hidden shadow-lg"
            >
              <Image
                src={product.imagen}
                alt={product.nombre}
                width={1000}
                height={1000}
                className="w-full h-52 object-cover rounded-full"
              />
              <div className="p-4">
                <h3 className="text-lg text-center">{product.nombre}</h3>
                <p className="text-blue-600 font-bold mt-4 text-center">
                  <span className="text-gray-600 font-semibold">Costo: </span>$
                  {product.precio}
                </p>
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="text-center hover:underline bg-cyan-300 text-black hover:bg-cyan-400"
                >
                  {isAlreadyInCart ? "Actualizar" : "Añadir al carrito"}
                  <AiOutlineShoppingCart />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {isInCart ? "Actualizar producto" : "Confirmación"}
            </h2>
            <p>
              {isInCart
                ? `¿Deseas actualizar el collar "${selectedProduct.nombre}" en el carrito?`
                : `¿Deseas agregar el collar  "${selectedProduct.nombre}" al carrito?`}
            </p>

            {/* Selector de cantidad */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Cantidad (Máximo 5):
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              />
            </div>

            {/* Cuadro de texto para la inicial del bebé */}
            {selectedProduct.nombre.includes("inicial") && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Inicial del bebé:
                </label>
                <input
                  type="text"
                  maxLength={1}
                  value={babyInitial}
                  onChange={(e) => setBabyInitial(e.target.value.toUpperCase())}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                />
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex justify-end mt-4 space-x-2">
              <Button
                onClick={closeModal}
                className="mr-2 bg-gray-300 text-black hover:bg-gray-400"
              >
                Cancelar
              </Button>
              {isInCart && (
                <Button
                  onClick={removeFromLocalStorage}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Eliminar <AiOutlineDelete />
                </Button>
              )}
              <Button
                onClick={updateLocalStorage}
                className="bg-cyan-300 text-black hover:bg-cyan-400"
              >
                {isInCart ? "Actualizar" : "Añadir"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};