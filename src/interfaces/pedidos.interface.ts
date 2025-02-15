export interface Pedidos_Usarios{
    id: string,
    image: string[],
    name: string[],
    cantidad: number[],
    price: number[],
    total: number,
    createdAt: {
        seconds: number,
        nanoseconds: number
    },
}