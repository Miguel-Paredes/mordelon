// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Para proteger rutas
export const auth = getAuth(app)
// Para conectarse con la base de datos
export const db = getFirestore(app)

// Iniciar sesion
export const singIn = async ( user : { email : string, password : string } ) => {
  return await signInWithEmailAndPassword(auth, user.email, user.password)
}

// Cerrar la sesion del usario
export const singOut = async () => {
  localStorage.removeItem('user')
  return await auth.signOut()
}

// Crear un nuevo usario
export const CreateUser = async ( user : { email : string, password : string } ) => {
  try {
    // Paso 1: Crear el usuario con email y contraseña
    const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
    const newUser = userCredential.user;

    // Paso 2: Enviar el correo de verificación
    await sendEmailVerification(newUser);
    console.log("Correo de verificación enviado a: ", user.email);

    return { success: true, message: "Usuario creado y correo de verificación enviado." };
  } catch ( error : any ) {
    console.error("Error al crear el usuario:", error.message);
    return { success: false, message: error.message };
  }
};

// Verificar si el correo del usuario ha sido confirmado
export const checkEmailVerification = async (user: any) => {
  try {
    // Primero, recargamos el usuario para asegurarnos de que la información de la verificación esté actualizada
    await user.reload();
    
    // Accedemos al documento del usuario en Firestore
    const userDocRef = doc(db, "users", user.uid); // Asumimos que tienes una colección "users" con el ID del usuario como documento
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      // Verificamos si el correo ha sido confirmado
      if (userData?.emailVerified) {
        console.log("El correo ha sido verificado.");
        return { success: true, message: "Correo verificado." };
      } else {
        console.log("El correo no ha sido verificado.");
        return { success: false, message: "Correo no verificado." };
      }
    } else {
      console.log("No se encontró el documento del usuario en la base de datos.");
      return { success: false, message: "Usuario no encontrado en la base de datos." };
    }
  } catch (error:any) {
    console.error("Error al verificar la confirmación del correo:", error);
    return { success: false, message: error.message };
  }
};

// Actualizar el nombre del usuario
export const updateUser = ( user : { displayName? : string | null  } ) => {
  if(auth.currentUser) return updateProfile(auth.currentUser, user)
}

// Guardar la informacion del usuario
export const setDocument = async ( path : string, data : any) => {
  data.createdAt = serverTimestamp()
  return setDoc(doc(db,path), data)
}