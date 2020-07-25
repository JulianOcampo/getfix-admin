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
    this.modelRef = this.db.collection(this.refPath, ref => ref.orderBy('name'));
  }

  getModelList(): AngularFirestoreCollection<Model> {
    return this.modelRef;
  }

  createModel(model: Model): Promise<any> {
    return this.modelRef.add(model);
  }

  updateModel(key: string, value: any): Promise<any> {
    return this.modelRef.doc(key).update(value);
  }

}
