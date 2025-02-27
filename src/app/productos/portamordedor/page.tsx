"use client";
import { addDocument, getColection, UpdateDocument } from "@/lib/firebase";
import { useUser } from "../../hooks/us-user";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Input,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { FileToBase64 } from "@/actions/convert-file-to-base64";
import { Products } from "@/interfaces/product.interfaces";

export default function Page() {
  const user = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [productos, setProductos] = useState<Products[]>([]);
  const [image, setImage] = useState("");
  const [modal, setModal] = useState(false);
  const [productoActualizar, setProductoActualizar] = useState<Products | null>(
    null
  );
  
  const obtenerChupones = async () => {
    try {
      const path = "portamordedores";
      const informacion = await getColection(path);
      setProductos(informacion as Products[]);
    } catch (error: any) {
      toast.error(error.message || "Error al obtener los productos");
    }
  };

  useEffect(() => {
    obtenerChupones();
  }, []);

  const formSchemaPortachupones = z.object({
    id: z.string(),
    nombre: z.string(),
    imagen: z.string(),
    cantidad: z.number().min(1).max(5),
  });

  const form = useForm<z.infer<typeof formSchemaPortachupones>>({
    resolver: zodResolver(formSchemaPortachupones),
    defaultValues: {
      id: "",
      nombre: "",
      imagen: "",
      cantidad: 0,
    },
  });

  const { register, handleSubmit, setValue, reset } = form;

  const onSubmit = async (item: Products) => {
    try {
      setIsLoading(true);

      if (productoActualizar) {
        console.log(productoActualizar)
        if (!item.imagen) {
          item.imagen = productoActualizar.imagen;
        }
        item.id = productoActualizar.id;
        // Modo de actualización
        const path = `portamordedores/${productoActualizar.id}`;
        await UpdateDocument(path, item);
        toast.success("Producto actualizado exitosamente");
      } else {
        // Modo de creación
        const path = "portamordedores";
        const obtenerId = await addDocument(path, item);
        item.id = obtenerId.id
        const pathId = `portamordedores/${item.id}`;
        await UpdateDocument(pathId, item);
        toast.success("Producto creado exitosamente");
      }

      setModal(false);
      setProductoActualizar(null);
    } catch (error: any) {
      toast.error(error.message || "Error al procesar el producto");
    } finally {
      setIsLoading(false);
      obtenerChupones();
    }
  };

  const uploadImageToCloudinary = async (base64: string) => {
    try {
      const response = await fetch("/productos/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file: base64 }),
      });
      if (!response.ok) {
        throw new Error("Error al subir la imagen");
      }
      const data = await response.json();
      if (!data.secure_url) {
        throw new Error("La URL de la imagen no está disponible");
      }
      return data.secure_url;
    } catch (error) {
      console.error("Error en uploadImageToCloudinary:", error);
      throw error;
    }
  };

  const deleteImage = async (image: string) => {
    if (!image) return;
    try {
      const parts = image.split("/");
      const fileName = parts.pop() || "";
      const publicId = fileName.split(".").shift() || "";
      if (!publicId) {
        throw new Error("No se pudo extraer el publicId de la imagen");
      }
      const response = await fetch("/productos/api/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId }),
      });
      if (!response.ok) {
        throw new Error("Error al eliminar la imagen");
      }
      const data = await response.json();
      console.log("Imagen eliminada:", data);
      setImage("");
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
    }
  };

  const chooseImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await FileToBase64(file);
      const imageUrl = await uploadImageToCloudinary(base64);

      if (productoActualizar && productoActualizar.imagen) {
        await deleteImage(productoActualizar.imagen); // Elimina la imagen anterior
      }

      setValue("imagen", imageUrl); // Actualiza el campo "imagen" del formulario
      setImage(imageUrl);
      toast.success("Imagen agregada");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Error al subir la imagen");
    } finally {
      setIsLoading(false);
      event.target.value = "";
    }
  };

  const handleActualizar = (producto: Products) => {
    setProductoActualizar(producto);
    setValue("nombre", producto.nombre);
    setValue("cantidad", producto.cantidad);
    setModal(true);
  };

  const handleCloseModal = () => {
    setModal(false);
    setProductoActualizar(null);
    reset();
    // setImage("");
  };

  return (
    <>
      {/* Botón para abrir el modal */}
      <div className="flex justify-end mt-4 mr-4">
        <Button
          className="bg-green-400 text-black"
          onClick={() => setModal(true)}
        >
          Crear Producto
        </Button>
      </div>

      {/* Modal */}
      <Dialog open={modal} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogTitle>
            {productoActualizar ? "Actualizar Producto" : "Crear Producto"}
          </DialogTitle>

          {/* Selector de imagen */}
          {image ? (
            <div className="text-center">
              <Image src={image} alt="Preview" width={100} height={100} className="mx-auto" />
              <Button
                onClick={() => {
                  if (productoActualizar && productoActualizar.imagen) {
                    deleteImage(productoActualizar.imagen);
                  }
                  setImage("");
                }}
                disabled={isLoading}
                className="mt-2"
              >
                Remover Imagen
              </Button>
            </div>
          ) : (
            <>
              <input
                id="file"
                type="file"
                onChange={chooseImage}
                accept="image/png, image/webp, image/jpeg"
                className="hidden"
              />
              <label htmlFor="file">
                <div className="w-20 h-20 mx-auto cursor-pointer rounded-lg text-white bg-slate-950 hover:bg-slate-600 flex justify-center items-center">
                  <ImagePlus className="w-20 h-20" />
                </div>
              </label>
            </>
          )}

          {/* Campo Nombre */}
          <Label>Nombre</Label>
          <Input {...register("nombre")} />

          {/* Campo Cantidad */}
          <Label>Cantidad</Label>
          <Input
            type="number"
            min="0"
            {...register("cantidad", { valueAsNumber: true })}
          />

          {/* Botones de acción */}
          <div className="flex justify-end gap-2">
            <Button onClick={handleCloseModal} type="button">
              Cancelar
            </Button>
            <Button onClick={handleSubmit(onSubmit)} disabled={isLoading}>
              {isLoading
                ? "Cargando..."
                : productoActualizar
                ? "Actualizar Producto"
                : "Crear Producto"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tabla de productos */}
      {productos.length === 0 ? (
        <p>No existen productos</p>
      ) : (
        <div className="w-full md:w-4/5 lg:w-3/4 mx-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N°</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Imagen</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos.map((producto, index) => (
                <TableRow key={index} className={`${producto.cantidad === 0 ? "bg-red-200" : ""}`}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell>
                    {producto.imagen && (
                      <Image
                        src={producto.imagen}
                        alt="Producto"
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                    )}
                  </TableCell>
                  <TableCell>{producto.cantidad}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleActualizar(producto)}>
                      Actualizar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
