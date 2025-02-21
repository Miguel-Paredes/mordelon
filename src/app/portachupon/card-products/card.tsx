"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { Productos } from "@/interfaces/productos.interface";
import Image from "next/image";
import { AiOutlineShoppingCart, AiOutlineDelete } from "react-icons/ai";
import toast from "react-hot-toast";
import { Portachupones } from "@/seed";

interface CardProductsProps {
  productos: Productos[];
}

export const CardProducts = ({ productos }: CardProductsProps) => {
  // Estados para controlar la lógica del componente
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Productos | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isInCart, setIsInCart] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);

  // Cargar el carrito desde localStorage cuando el componente se monta
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(currentCart);
    }
  }, []);

  // Función para abrir el modal y seleccionar el producto
  const handleAddToCart = (product: Productos) => {
    setSelectedProduct(product);

    // Verificar si el producto ya está en el carrito
    const existingProduct = cartItems.find(
      (item: any) => item.nombre === product.nombre
    );

    if (existingProduct) {
      setIsInCart(true); // El producto ya está en el carrito
      setQuantity(existingProduct.quantity); // Cargar la cantidad previamente ingresada
      setSelectedImages(existingProduct.selectedImages || []); // Cargar las imágenes seleccionadas
    } else {
      setIsInCart(false); // El producto no está en el carrito
      setQuantity(1); // Reiniciar la cantidad
      setSelectedImages([]); // Reiniciar las imágenes seleccionadas
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
      // Validar la selección de imágenes solo para "Con clip de varios diseños a elección"
      if (
        selectedProduct.nombre.includes("diseños a elección") &&
        selectedImages.length === 0
      ) {
        toast.error("Debes seleccionar al menos una imagen.");
        return;
      }

      if (
        selectedProduct.nombre.includes("diseños a elección") &&
        selectedImages.length !== quantity
      ) {
        const remaining = quantity - selectedImages.length;
        toast.error(
          remaining > 0
            ? `Debes seleccionar ${remaining} imagen${
                remaining > 1 ? "es" : ""
              } más.`
            : `Has seleccionado demasiadas imágenes. Solo puedes seleccionar ${quantity}.`
        );
        return;
      }

      // Crear un objeto con la información del producto, cantidad e imágenes seleccionadas
      const productToUpdate = {
        ...selectedProduct,
        quantity,
        selectedImages:
          selectedProduct.nombre.includes("diseños a elección") &&
          selectedImages.length === 1
            ? Array(quantity).fill(selectedImages[0])
            : selectedImages,
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

  // Función para manejar la selección de imágenes
  const handleImageSelect = (image: string) => {
    if (selectedImages.includes(image)) {
      setSelectedImages(selectedImages.filter((img) => img !== image)); // Deseleccionar
    } else {
      if (selectedImages.length < quantity) {
        setSelectedImages([...selectedImages, image]); // Seleccionar
      } else {
        toast.error(`Solo puedes seleccionar hasta ${quantity} imágenes`);
      }
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
                ? `¿Deseas actualizar el portachupón ${selectedProduct.nombre.toLowerCase()} en el carrito?`
                : `¿Deseas agregar el portachupón ${selectedProduct.nombre.toLowerCase()} al carrito?`}
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

            {/* Selección de imágenes */}
            {selectedProduct.nombre.includes("diseños a elección") && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Selecciona hasta {quantity} imágenes:
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Portachupones.map((clip, index) => (
                    <div
                      key={index}
                      onClick={() => handleImageSelect(clip.imagen)}
                      className={`w-16 h-16 rounded-full cursor-pointer ${
                        selectedImages.includes(clip.imagen)
                          ? "border-2 border-blue-500"
                          : ""
                      }`}
                    >
                      <Image
                        src={clip.imagen}
                        alt={`Diseño ${index}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  ))}
                </div>
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
