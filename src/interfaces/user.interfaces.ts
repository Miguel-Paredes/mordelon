import { Timestamp } from "firebase/firestore"

export interface User {
    uid: string,
    password?: string,
    name: string,
    email: string
    createdAt: Timestamp,
    phone: string
}