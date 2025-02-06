// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
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
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Para proteger rutas
export const auth = getAuth(app);
// Para conectarse con la base de datos
export const db = getFirestore(app);

// Iniciar sesion
export const singIn = async (user: { email: string; password: string }) => {
  try {
    // Esperar la respuesta de la consulta
    const informacion = await getUserByEmail(user.email);

    // Verificar si el usuario no existe
    if (!informacion) {
      return { success: false, message: "Ese usuario no existe" };
    }

    // Intentar iniciar sesión
    await signInWithEmailAndPassword(auth, user.email, user.password);
  } catch (error: any) {
    // Manejar errores específicos de autenticación
    if (error.code === "auth/invalid-credential") {
      return { success: false, message: "Usuario y/o contraseña incorrectos" };
    } else {
      return { success: false, message: error.code };
    }
  }
  return { success: true, message: "Bienvenido" };
};

async function getUserByEmail(email: string) {
  // Accedemos a la colección 'users'
  const usersCollectionRef = collection(db, "users");

  // Obtenemos los documentos de la colección de usuarios
  const querySnapshot = await getDocs(usersCollectionRef);

  // Recorremos todos los documentos (usuarios) dentro de la colección 'users'
  for (const userDoc of querySnapshot.docs) {
    // Accedemos a la subcolección con el nombre del ID del usuario
    const userSubCollectionRef = collection(db, "users", userDoc.id, userDoc.id); 

    // Creamos una consulta para filtrar por correo electrónico dentro de esa subcolección
    const q = query(userSubCollectionRef, where("email", "==", email));

    // Obtener los documentos de la subcolección filtrados
    const subQuerySnapshot = await getDocs(q);

    // Verificamos si encontramos algún documento con el correo buscado
    if (!subQuerySnapshot.empty) {
      // Si encontramos el correo, devolvemos los datos del usuario
      let userData = null;
      subQuerySnapshot.forEach((doc) => {
        userData = doc.data(); // Tomamos los datos del usuario
      });
      return userData; // Devolvemos la información del primer usuario encontrado
    }
  }

  // Si no encontramos ningún usuario con ese correo, devolvemos null
  return null;
}


// Cerrar la sesion del usario
export const singOut = async () => {
  localStorage.removeItem("user");
  await auth.signOut().catch((error) => {
    return { success: false, message: "Error al cerrar la sesión" };
  });
  return { success: true, message: "Gracias por venir" };
};

// Crear un nuevo usario
export const CreateUser = async ( user : { name: string, email: string, password: string } ) => {
  return createUserWithEmailAndPassword(auth, user.email, user.password)
}

// Actualizar el nombre del usuario
export const updateUser = (user: { displayName?: string | null }) => {
  if (auth.currentUser) return updateProfile(auth.currentUser, user);
};

// Guardar la informacion del usuario
export const setDocument = async (path: string, data: any) => {
  data.createdAt = serverTimestamp();
  return setDoc(doc(db, path), data);
};

// Obtener la informacion de una collecion
export const getDocument = async (path: string) => {
  return (await getDoc(doc(db, path))).data();
};

// Reestablecer la contraseña mediante un correo
export const sendtResetEmail = async ( email: string ) => {
  return await sendPasswordResetEmail(auth, email)
}