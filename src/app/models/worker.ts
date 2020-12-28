import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, } from '@angular/fire/firestore'
import { GeoFire } from 'geofire';

export class Worker {
    id: string;
    name: string;
    email: string;
    address: string;
    phoneNumber: string;
    certificate: string;
    fullName: string;
    profileImage: string;
    workerStatus: string;
    g: GeoPoint;
    error: boolean;

}
class GeoPoint {
    geohash: string;
    geopoint: { latitude: number; longitude: number; };
}