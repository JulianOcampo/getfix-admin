import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { ServiceRequesDocument } from '../models/service-request-document';

@Injectable({
  providedIn: 'root'
})
export class GetfixRequestsService {
  private serviceReqRefPath = environment.firebaseRef.serviceRequest;
  private brandReqRefPath = environment.firebaseRef.brand;
  private userRefEn = environment.firebaseRef.user;
  private workerRefEn = environment.firebaseRef.worker;
  private serviceReqRef: AngularFirestoreCollection<any>;
  private brandReqRef: AngularFirestoreDocument<any>;
  serviceRequest: Array<ServiceRequesDocument> = [];
  serviceRequestCanceledByClient: Array<ServiceRequesDocument> = [];
  serviceRequestCanceledByWorker: Array<ServiceRequesDocument> = [];
  constructor(
    private db: AngularFirestore,
  ) {
  }

  getUserHistory(userId: string): AngularFirestoreCollection<any> {
    let userRef = this.db.doc(this.userRefEn + '/' + userId).ref;

    this.serviceReqRef = this.db.collection(this.serviceReqRefPath, ref => ref.where('refUserId', '==', userRef));
    return this.serviceReqRef;
  }

  getWorkerHistory(workerId: string): AngularFirestoreCollection<any> {
    let workerRef = this.db.doc(this.workerRefEn + '/' + workerId).ref;
    return this.db.collection(this.serviceReqRefPath, ref => ref.where('refWorkerId', '==', workerRef));
  }

  getBrandId(refBrandId: DocumentReference): AngularFirestoreDocument<any> {
    return this.brandReqRef = this.db.doc(refBrandId);
  }

  getServicesRequest(): AngularFirestoreCollection<ServiceRequesDocument> {
    return this.db.collection(this.serviceReqRefPath);
  }
}
