import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore'
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Worker } from '../models/worker'
import { WorkerBankStorage } from '../models/worker-bank-storage';
import { WorkerLocation } from '../models/worker-location';
@Injectable({
  providedIn: 'root'
})
export class WorkerService {

  private pathRef = environment.firebaseRef.worker;
  private workerLocation = environment.firebaseRef.location;
  private bankStorage = environment.firebaseRef.bankStorage;
  private workerRef: AngularFirestoreCollection<Worker>;
  public workers: Array<Worker> = [];
  public workersPendingToAccepted: Array<Worker> = [];

  private sendWorkersSubject = new Subject<Worker[]>();
  private sendWorkersPendingToAcceptedSubject = new Subject<Worker[]>();

  sendWorkersObservable = this.sendWorkersSubject.asObservable();
  sendWorkersPendingToAcceptedObservable = this.sendWorkersPendingToAcceptedSubject.asObservable();

  private apiUrl = environment.firebaseFunctionApi.url;
  private workerStatusPoint = environment.firebaseFunctionApi.workerStatus;
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
    this.workerRef = this.db.collection(this.pathRef)
  }


  getWorkerList(): AngularFirestoreCollection<Worker> {
    return this.workerRef
  }

  getWorker(id: string): AngularFirestoreDocument<any> {
    return this.workerRef.doc(id);
  }

  getWorkerBankStorage(id: string): AngularFirestoreDocument<WorkerBankStorage> {
    return this.workerRef.doc(id).collection(this.bankStorage).doc(id);
  }

  getWorkerByStatus(status: number): AngularFirestoreCollection<Worker> {
    if (status == -1) {
      return this.db.collection(this.pathRef);
    } else {
      return this.db.collection(this.pathRef, ref => ref.where('workerStatus', '==', status));
    }
  }

  getWorkerLocation(workerRefId: DocumentReference): AngularFirestoreDocument<WorkerLocation> {
    return this.db.collection(this.pathRef).doc(workerRefId.id).collection(this.workerLocation).doc(workerRefId.id);
  }

  updateWorkers(workers: Worker[]) {
    this.workers = workers;
    this.sendWorkersSubject.next(workers);
  }

  updateWorkersPendingToAccepted(workers: Worker[]) {
    this.workersPendingToAccepted = workers;
    this.sendWorkersPendingToAcceptedSubject.next(workers);
  }

  updateWorkerState(workerId: string, workerStatus: number): Observable<any> {
    return this.http.post(this.apiUrl + this.workerStatusPoint,
      {
        workerId: workerId,
        workerStatus: workerStatus
      }, { observe: 'body', ...this.httpOptions })
  }
}
