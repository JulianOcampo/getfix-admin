import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
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

  getWorker(id: string): AngularFirestoreDocument<any> {
    return this.workerRef.doc(id);
  }
}
