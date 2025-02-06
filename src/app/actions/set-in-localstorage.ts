'use client'

// ! Funcion para guardar en el localstorage
export const setInLoacalStorage = (key: string, value: any) => {
    // Enviamos la key y siempre retorna el valor en formato JSON
    return localStorage.setItem(key, JSON.stringify(value))
}