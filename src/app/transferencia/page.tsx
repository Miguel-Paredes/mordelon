import Image from "next/image";

export default function Transferencia() {
  return (
    <div className="flex justify-center my-4">
      <Image
        src={"/cuenta-bancaria.jpeg"}
        alt="Cuenta Bancaria"
        width={1000}
        height={1000}
        className="rounded-lg h-auto max-w-md"
      />
    </div>
  )
}
