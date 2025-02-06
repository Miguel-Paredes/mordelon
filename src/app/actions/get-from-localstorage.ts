'use client'

// ! Funcion para guardar en el localstorage
export const getFromLoacalStorage = (key: string) => {
    // Enviamos la key y siempre retorna el valor en formato JSON
    return JSON.parse(localStorage.getItem(key) as string)
}