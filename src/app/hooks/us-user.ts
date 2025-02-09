'use client'
import { User } from "@/interfaces/user.interfaces"
import { auth, getDocument } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { DocumentData } from "firebase/firestore"
import { useEffect, useState } from "react"
import { getFromLoacalStorage, setInLoacalStorage } from "../actions"
import { usePathname, useRouter } from "next/navigation"

export const useUser = () => {
    const [user, setUser] = useState<User | undefined | DocumentData>(undefined)

    const pathName = usePathname();
    const router = useRouter()
    // Definimos las rutas a las que no se deben de acceder si no esta logueado
    const protectedRoutes = ["/pedidos", "/dashboard"];
    // Verifica las rutas en las que se encuentra el usuario
    const isInProtectedRoutes = protectedRoutes.includes(pathName);

    const gerUserFromBD = async (uid:string) => {
        const path = `users/${uid}`
        try {
            const res = await getDocument(path)
            setUser(res)
            setInLoacalStorage('user', res)
        } catch (error) {
            
        }
    }
    useEffect(() => {
        return onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                const userInLocal = getFromLoacalStorage('user')
                if(userInLocal) return setUser(userInLocal)
                else gerUserFromBD(authUser.uid)
            }else{
                // En caso de cerrar sesion o que no este iniciado, declaramos undefinedre
                setUser(undefined)
                if(isInProtectedRoutes) return router.push('/auth')
            }
        })
    }, [])
    return user
}