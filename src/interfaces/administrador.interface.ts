export interface Pedidos_Administrador {
  id: string;
  phone: string;
  image: string[];
  babyInitial: string[];
  nombre_bebe: string;
  selectedImages: string[],
  direccion: string;
  name: string[];
  cantidad: number[];
  price: number[];
  total: number;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}