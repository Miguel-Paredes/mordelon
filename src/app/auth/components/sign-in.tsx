"use client";
import * as z from "zod";
import { Input, Label } from "@/components/ui";
import { Button } from "@/components/ui";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkEmailVerification, singIn } from "@/lib/firebase";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

export default function SignIn() {
  const [isLoading, setisLoading] = useState<boolean>(false);

  // ! Información necesaria para el registro de credenciales
  const formSchema = z.object({
    email: z
      .string()
      .email("El formato del correo no es valido. Ejemplo: user@gmail.com")
      .min(1, {
        message: "Este campo es requerido",
      }),
    password: z.string().min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    }),
  });

  // * Validación de datos
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  // todo: Envio de datos a la base de datos
  const onSubmit = async (user: z.infer<typeof formSchema>) => {
    console.log(user);
    setisLoading(true);
    try {
      const verification = await checkEmailVerification(user);
      if(!verification.success) return toast(`No ha verificado su correo`)
      await singIn(user);
      toast(`!Bienvenido¡`, { duration: 5000, icon: "😎" });
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
    <>
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="text-sm text-muted-foreground">
          Coloca tu email y contraseña para poder acceder
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
          <div className="flex justify-center">
            <span className="text-red-500 w-max rounded-lg pt-1">
              {errors.email?.message}
            </span>
          </div>
          {/* Contraseña */}
          <div className="mb-3">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              {...register("password")}
              id="password"
              placeholder="******"
              type="password"
            />
          </div>
          <div className="flex justify-center">
            <span className="text-red-500 w-max rounded-lg pt-1">
              {errors.password?.message}
            </span>
          </div>
          <Link
            href={"/auth/forgot-password"}
            className="underline text-muted-foreground underline-offset-4 hover:text-primary mb-6 text-sm text-end"
          >
            ¿Olvidaste tu contraseña?
          </Link>
          <Button type="submit">
            {isLoading ? (
              <LoaderCircle className="w-6 h-6 animate-spin" />
            ) : (
              "Ingresar"
            )}
          </Button>
        </div>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        No tienes cuenta?{" "}
        <Link
          href={"/auth/sign-up"}
          className="underline underline-offset-4 hover:text-primary"
        >
          Registrarse
        </Link>
      </p>
    </>
  );
}
