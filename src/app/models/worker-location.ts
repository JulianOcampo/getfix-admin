import { firestore } from "firebase";

export class WorkerLocation {
    id: string;
    coordinates: firestore.GeoPoint;
}