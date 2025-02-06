"use client";
import * as z from "zod";
import { Input, Label } from "@/components/ui";
import { Button } from "@/components/ui";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUser, setDocument, updateUser } from "@/lib/firebase";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import { User } from "@/interfaces/user.interfaces";
import { redirect } from "next/navigation";

export default function SignUp() {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [createCount, setCreateCount] = useState<boolean>(false);

  // ! Información necesaria para el registro de credenciales
  const formSchema = z.object({
    uid: z.string(),
    name: z.string().min(4, "El nombre no puede ser menor a 4 caracteres"),
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
      uid: "",
      name: "",
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
    let cuenta = true;
    try {
      setCreateCount(true);
      const usercreate = await CreateUser(user);
      await updateUser({ displayName: user.name });
      user.uid = usercreate.user.uid;
      await createUserInDB(user as User);
      toast.success(`Bienvenido ${user.name}`, { duration: 5000 });
      cuenta = false
    } catch (error: any) {
      const errorCreateUser = error.code;
      if (errorCreateUser === "auth/email-already-in-use") {
        return toast.error("El correo ya está en uso", { duration: 5000 });
      } else if (errorCreateUser === "auth/invalid-email") {
        return toast.error("El correo no es válido", { duration: 5000 });
      }
    } finally {
      setisLoading(false);
      setTimeout(() => {
        setCreateCount(false);
      }, 5000);
      if (!cuenta) return redirect("/auth");
    }
  };

  const createUserInDB = async (user: User) => {
    const path = `users/${user.uid}`;
    setisLoading(true);
    try {
      delete user.password;
      await setDocument(path, user);
    } catch (error: any) {
      toast.error(error.message, { duration: 5000 });
    } finally {
      setisLoading(false);
    }
  };

  return (
    <>
      <div className="text-center pt-10">
        <h1 className="text-2xl font-semibold">Registro</h1>
        <p className="text-sm text-muted-foreground">
          Ingresa la siguiente información para poder crear tu cuenta
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          {/* Usuario */}
          <div className="mb-3">
            <Label htmlFor="name">Nombre</Label>
            <Input
              {...register("name")}
              id="name"
              placeholder="Juan Perez"
              type="text"
              autoComplete="name"
            />
          </div>
          <div className="flex justify-center">
            <span className="text-red-500 w-max rounded-lg pt-1">
              {errors.name?.message}
            </span>
          </div>
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
          <Button type="submit">
            {isLoading ? (
              <LoaderCircle className="w-6 h-6 animate-spin" />
            ) : (
              "Crear"
            )}
          </Button>
        </div>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Ya tienes una cuenta?{" "}
        <Link
          href={"/auth"}
          className="underline underline-offset-4 hover:text-primary"
        >
          Volver
        </Link>
      </p>
    </>
  );
}
