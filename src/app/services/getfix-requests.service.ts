import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetfixRequestsService {
  private serviceReqRefPath = environment.firebaseRef.serviceRequest;
  private brandReqRefPath = environment.firebaseRef.brand;
  private userRefEn = environment.firebaseRef.user;
  private serviceReqRef: AngularFirestoreCollection<any>;
  private brandReqRef: AngularFirestoreDocument<any>;

  constructor(
    private db: AngularFirestore,
  ) {
  }

  getUserHistory(userId: string): AngularFirestoreCollection<any> {
    let userRef = this.db.doc(this.userRefEn + '/' + userId).ref;    
    this.serviceReqRef = this.db.collection(this.serviceReqRefPath, ref => ref.where('refUserId', '==', userRef));
    return this.serviceReqRef;
  }

  getBrandId(refBrandId: DocumentReference): AngularFirestoreDocument<any> {
    return this.brandReqRef = this.db.doc(refBrandId);
  }
}
