import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, } from '@angular/fire/firestore'
import { GeoFire } from 'geofire';

export class Worker {
    id: string;
    email: string;
    address: string;
    phoneNumber: string;
    certificate: string;
    fullName: string;
    profileImage: string;
    workerStatus: number;
    token: string;
    avgRating: number;
    numRatings: number;
    g: GeoPoint;
    error: boolean;

}
class GeoPoint {
    geohash: string;
    geopoint: { latitude: number; longitude: number; };
}