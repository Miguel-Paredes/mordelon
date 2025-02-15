"use client";

import PedidosCellPhone from "./celphone";
import PedidosDesktop from "./desktop";

export default function PedidosAdministrador() {
  return(
    <>
      <div className="hidden md:block">
        <PedidosDesktop/>
      </div>
      <div className="block md:hidden">
        <PedidosCellPhone/>
      </div>
    </>
  )
}