import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ServiceRequestDocument } from '../models/service-request-document';


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
  private apiUrl = environment.firebaseFunctionApi.url;
  private completePaymentPoint = environment.firebaseFunctionApi.completePayment;
  private cancelPaymentPoint = environment.firebaseFunctionApi.cancelPayment;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }),
  }
  constructor(
    private db: AngularFirestore,
    private http: HttpClient,
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

  getServicesRequest(): AngularFirestoreCollection<ServiceRequestDocument> {
    return this.db.collection(this.serviceReqRefPath);
  }

  getServiceRequest(serviceRequestId: string): AngularFirestoreDocument<ServiceRequestDocument> {
    return this.db.collection(this.serviceReqRefPath).doc(serviceRequestId);
  }

  cancelPayment(paymentId: string): Observable<any> {
    return this.http.post(this.apiUrl + this.cancelPaymentPoint,
      {
        payment_id: paymentId,
      }, { observe: 'body', ...this.httpOptions })
  }

  completePayment(paymentId: string): Observable<any> {
    return this.http.post(this.apiUrl + this.completePaymentPoint,
      {
        payment_id: paymentId,
      }, { observe: 'body', ...this.httpOptions })
  }

  async updateServiceRequest(serviceId: string, serviceReq: any): Promise<boolean> {
    try {
      await this.db.collection(this.serviceReqRefPath).doc(serviceId).update(serviceReq);
      return true;
    } catch (error) {
      return false;
    }
  }


}
