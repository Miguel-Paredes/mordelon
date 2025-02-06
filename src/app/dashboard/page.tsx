"use client";
import { Button } from "@/components/ui";
import { singOut } from "@/lib/firebase";

export default function Dashboard() {
  return (
    <>
      <div>Dashboard</div>
      <Button onClick={() => singOut()}>Cerrar Sesión</Button>
    </>
  );
}
