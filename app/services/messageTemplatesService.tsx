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

export type category = "umum" | "keuangan"|'meeting'|"operasional"|"marketing"|"hr";

export async function name(
    title:string,
    content:string,
    

) {
    
}