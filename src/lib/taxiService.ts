import {
  addDoc,
  collection,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";

export interface TaxiDriver {
  id: string;
  name: string;
  plate: string;
  isActive?: boolean;
}

export interface TaxiReferralLog {
  taxiId: string;
  taxiName: string;
  taxiPlate: string;
  source?: string;
  whatsappMessage: string;
  userAgent?: string;
  locale?: string;
}

const TAXI_COLLECTION = "taxiDrivers";
const REFERRAL_COLLECTION = "taxiReferrals";

export const getTaxiDrivers = async (): Promise<TaxiDriver[]> => {
  try {
    const snapshot = await getDocs(collection(db, TAXI_COLLECTION));
    const drivers: TaxiDriver[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      if (!data) return;

      drivers.push({
        id: doc.id,
        name: data.name ?? "",
        plate: data.plate ?? "",
        isActive: data.isActive ?? true,
      });
    });

    return drivers
      .filter((driver) => driver.name && driver.plate && driver.isActive !== false)
      .sort((a, b) => a.name.localeCompare(b.name, "tr"));
  } catch (error) {
    console.error("Taksi listesi alınamadı:", error);
    throw new Error("Taksiciler getirilemedi");
  }
};

export const logTaxiReferral = async (
  payload: TaxiReferralLog
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, REFERRAL_COLLECTION), {
      ...payload,
      createdAt: new Date().toISOString(),
      timestamp: new Date(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Taksi yönlendirmesi kaydedilemedi:", error);
    throw new Error("Yönlendirme kaydedilemedi");
  }
};
