export interface Pedidos_Usarios{
    id: string,
    image: string[],
    babyInitial: string[]
    direccion: string,
    name: string[],
    cantidad: number[],
    price: number[],
    total: number,
    selectedImages: string[],
    createdAt: {
        seconds: number,
        nanoseconds: number
    },
    estado: "En revisión" | "Pagado";
}