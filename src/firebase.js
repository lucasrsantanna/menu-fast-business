// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1pnX64zodp4zN_43OUYbIJyZmHl7kan8",
  authDomain: "menu-fast-a836a.firebaseapp.com",
  projectId: "menu-fast-a836a",
  storageBucket: "menu-fast-a836a.firebasestorage.app",
  messagingSenderId: "68884739506",
  appId: "1:68884739506:web:a8436071db1e112698a0ab",
  measurementId: "G-VCWYT664WP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

export async function signUp(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error) {
    let message = 'Erro ao registrar usuário.';
    if (error.code === 'auth/email-already-in-use') message = 'E-mail já está em uso.';
    else if (error.code === 'auth/invalid-email') message = 'E-mail inválido.';
    else if (error.code === 'auth/weak-password') message = 'A senha deve ter pelo menos 6 caracteres.';
    return { error: message };
  }
}

export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error) {
    let message = 'Erro ao fazer login.';
    if (error.code === 'auth/user-not-found') message = 'Usuário não encontrado.';
    else if (error.code === 'auth/wrong-password') message = 'Senha incorreta.';
    else if (error.code === 'auth/invalid-email') message = 'E-mail inválido.';
    return { error: message };
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { error: 'Erro ao sair da conta.' };
  }
}

export function onAuthStateChangedListener(callback) {
  return onAuthStateChanged(auth, callback);
}