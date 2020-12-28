import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import { LocalDataSource } from 'ng2-smart-table';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Worker } from '../models/worker'
@Injectable({
  providedIn: 'root'
})
export class WorkerService {

  private pathRef = environment.firebaseRef.worker;
  private workerRef: AngularFirestoreCollection<Worker>;
  constructor(
    private db: AngularFirestore,
  ) {
    this.workerRef = this.db.collection(this.pathRef)
  }
  public workers: Array<Worker> = [];


  getWorkerList(): AngularFirestoreCollection<Worker> {
    return this.workerRef
  }

  getWorker(id: string): AngularFirestoreDocument<any> {
    return this.workerRef.doc(id);
  }

  getWorkerByStatus(status: number): AngularFirestoreCollection<Worker> {
    return this.db.collection(this.pathRef, ref => ref.where('workerStatus', '==', status));
  }
}
