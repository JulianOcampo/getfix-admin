import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Model } from '../models/model';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  private refPath = environment.firebaseRef.model;
  private modelRef: AngularFirestoreCollection<Model>;
  constructor(
    private db: AngularFirestore,
  ) {
    this.modelRef = this.db.collection(this.refPath);
  }

  getModelList(): AngularFirestoreCollection<Model> {
    return this.modelRef;
  }

  
}
