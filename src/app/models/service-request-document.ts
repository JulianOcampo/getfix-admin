import { firestore } from "firebase";

export class ServiceRequestDocument {
    id: string;
    bill: Bill;
    dateEnd: firestore.Timestamp;
    dateEstimatedArrival: firestore.Timestamp;
    dateStart: firestore.Timestamp;
    locationRequest: firestore.GeoPoint;
    locationResponse: firestore.GeoPoint;
    reasons: Reasons;
    refBrandId: firestore.DocumentReference;
    refCategoryId: firestore.DocumentReference;
    refUserId: firestore.DocumentReference;
    refWorkerId: firestore.DocumentReference;
    serviceHistory: boolean;
    serviceRepair: serviceRepair;
    stateService: number;
    user: User;
    worker: Worker;
}

class Reasons {
    admin: string;
    user: string;
    worker: string;
}
class Bill {
    canceledId: string;
    fineAmount: number;
    paymentId: string;
    statusCanceled: string;
    statusPayment: string;
    lastDateChange: firestore.Timestamp
}

class serviceRepair {
    brandType: string;
    categoryType: string;
    issues: Array<Issues>
    modelColor: ModelColor;
    modelDescription: string;
    modelImage: string;
    modelType: string;
    totalPrice: number;
}

class Issues {
    description: string
    id: string;
    issueImage: string;
    price: number;
    proofImage: string;
    title: string;

}

class ModelColor {
    hexaValue: string;
    name: string;
}

class User {
    email: string;
    fullName: string;
    phoneNumber: string;
    profileImage: string;
}

class Worker {
    email: string;
    fullName: string;
    phoneNumber: string;
    profileImage: string;
}