"use client";
import * as z from "zod";
import { Input, Label } from "@/components/ui";
import { Button } from "@/components/ui";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendtResetEmail, singIn } from "@/lib/firebase";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RecoverPassword() {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const router = useRouter()
  // ! Información necesaria para el registro de credenciales
  const formSchema = z.object({
    email: z
      .string()
      .email("El formato del correo no es valido. Ejemplo: user@gmail.com")
      .min(1, {
        message: "Este campo es requerido",
      }),
  });

  // * Validación de datos
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  // todo: Envio de datos a la base de datos
  const onSubmit = async (user: z.infer<typeof formSchema>) => {
    setisLoading(true);
    try {
      await sendtResetEmail(user.email)
      toast.success("Verifique su correo para restablecer su contraseña. Si no lo encuentra en la bandeja de entrada, por favor revise la carpeta de Spam.", { duration : 5000 })
      router.push('/')
    } catch (error: any) {
      toast.error(
        // Mostramos el mensaje de error
        error.message,
        // Duracion que se ve el mensaje
        { duration: 5000 }
      );
    } finally {
      setisLoading(false);
    }
  };

  return (
    <div className="md:border border-solid border-x-gray-300 rounded-xl p-10">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Recuperar contraseña</h1>
        <p className="text-sm text-muted-foreground">
          Te enviaremos un correo para que puedas recuperar tu contraseña
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          {/* Correo */}
          <div className="mb-3">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email")}
              id="email"
              placeholder="name@example.com"
              type="email"
              autoComplete="email"
            />
          </div>
            <span className="text-red-500 w-auto rounded-lg pt-1 text-center">
              {errors.email?.message}
            </span>
          <Button type="submit">
            {isLoading ? (
              <LoaderCircle className="w-6 h-6 animate-spin" />
            ) : (
              "Recuperar contraseña"
            )}
          </Button>
        </div>
      </form>
      <p className="text-center text-sm text-muted-foreground mt-3">
        <Link
          href={"/auth"}
          className="underline underline-offset-4 hover:text-primary"
        >
          Regresar
        </Link>
      </p>
    </div>
  );
}
