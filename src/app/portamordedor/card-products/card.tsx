"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import Image from "next/image";
import { AiOutlineShoppingCart, AiOutlineDelete } from "react-icons/ai";
import toast from "react-hot-toast";
import { Products } from "@/interfaces/product.interfaces";
import { getColection } from "@/lib/firebase";

export const CardProducts = () => {
  // Estados para controlar la lógica del componente
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Products | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [productos, setProductos] = useState<Products[]>([])

  // Cargar el carrito desde localStorage cuando el componente se monta
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(currentCart);
    }
    const obtenerChupones = async () => {
      try {
        const path = "portamordedores";
        const informacion = await getColection(path);
        setProductos(informacion as Products[]);
      } catch (error: any) {
        toast.error(error.message || "Error al obtener los productos");
      }
    };
    obtenerChupones();
  }, []);

  // Función para abrir el modal y seleccionar el producto
  const handleAddToCart = (product: Products) => {
    setSelectedProduct(product);

    // Verificar si el producto ya está en el carrito
    const existingProduct = cartItems.find(
      (item: any) => item.nombre === product.nombre
    );

    if (existingProduct) {
      setIsInCart(true); // El producto ya está en el carrito
      setQuantity(existingProduct.quantity); // Cargar la cantidad previamente ingresada
    } else {
      setIsInCart(false); // El producto no está en el carrito
      setQuantity(1); // Reiniciar la cantidad
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
      // Crear un objeto con la información del producto y cantidad
      const productToUpdate = {
        ...selectedProduct,
        quantity,
        precio: 5
      };

      // Actualizar el carrito
      const updatedCart = isInCart
        ? cartItems.map((item: any) =>
            item.nombre === selectedProduct.nombre ? productToUpdate : item
          )
        : [...cartItems, productToUpdate];

      // Guardar el carrito actualizado en el localStorage
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      // LLamar al evento creado para agregar o quitar cosas del carrito
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(
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
      // Filtrar el carrito para eliminar el producto
      const updatedCart = cartItems.filter(
        (item: any) => item.nombre !== selectedProduct.nombre
      );

      // Guardar el carrito actualizado en el localStorage
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      // LLamar al evento creado para agregar o quitar cosas del carrito
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Producto eliminado del carrito!");
      closeModal();
    }
  };

  return (
    <div>
      {/* Lista de productos */}
      <div className="flex flex-wrap w-full gap-8 justify-center pt-4">
        {productos.map((product, index) => {
          const existingProduct = cartItems.find(
            (item: any) => item.nombre === product.nombre
          );
          const isAlreadyInCart = !!existingProduct;

          if(product.cantidad <= 0) return null

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
                  <span className="text-gray-600 font-semibold">Costo: </span>$5
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
                ? `¿Deseas actualizar el portamordedor ${selectedProduct.nombre.toLowerCase()} en el carrito?`
                : `¿Deseas agregar el portamordedor ${selectedProduct.nombre.toLowerCase()} al carrito?`}
            </p>

            {/* Selector de cantidad */}
            {/* <div className="mt-4">
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
            </div> */}

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
