import { auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import type { Contact, ContactType } from "@/lib/types";


export async function  createContact(data:{
    name: string;
    identifier: string;
    type : ContactType;
    description?: string
}) {

    const uid = auth.currentUser?.uid

    if (!uid) throw new Error("Login dulu COK")
    
    const contactId = encodeURIComponent(data.identifier);
    const ref = doc(db,"users",uid,"contatcs",contactId)

    const exists = await getDoc(ref);
    if (exists.exists() )throw new Error("Kontak Sudah ada")

    await setDoc(ref, {
        ...data,
        description: data.description || "",
        createAt: serverTimestamp(),
        updateAt: serverTimestamp()
    })

    return {
        id: contactId,
        ...data,
    };
}

export async function getContacts(): Promise<Contact[]> {
    const uid = auth.currentUser?.uid

    if (!uid) throw new Error("Login dulu")
    
    const ref = collection(db,"users",uid,"contatcs")
    const snap = await getDocs(ref);

    return snap.docs.map((docSnap) => ({
        id: docSnap.id,
        name: docSnap.data().name || "",
        identifier: docSnap.data().identifier || "",
        type: docSnap.data().type || "number",
        description: docSnap.data().description || "",
        createdAt: docSnap.data().createdAt?.toDate
            ? docSnap.data().createdAt.toDate().toISOString()
            : docSnap.data().createdAt || new Date().toISOString(),
    } as Contact));
    
}

export async function getContact(id:string) {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Login dulu COK");

    const ref = doc(db,"users",uid,"contacts",id)
    const snap = await getDoc(ref)

    if(!snap.exists()) return null;

    return{
        id: snap.id,
        ...snap.data()
    }

}

export async function updateContact(
    id: string,
    data: Partial<{
        name: string;
        identifier: string;
        type: ContactType;
        description: string;
    }>

) {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Login dulu COK");

    const ref = doc(db,"users",uid,"contatcs",id)

    await updateDoc(ref,{
        ...data,
        updateAt: serverTimestamp()
    });
    
}


export async function deleteContact(id:string) {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Login dulu COK");

    const ref = doc(db,"users",uid,"contatcs",id)

    await deleteDoc(ref)


    
}