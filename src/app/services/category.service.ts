import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Category } from '../models/category';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/storage';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private refPath = environment.firebaseRef.category;
  private categoryRef: AngularFirestoreCollection<Category>;
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.categoryRef = this.db.collection(this.refPath);
  }

  getCategoriesList(): AngularFirestoreCollection<Category> {
    return this.categoryRef;
  }

  updateCategory(key: string, value: any): Promise<any> {
    return this.categoryRef.doc(key).update(value);
  }

  createCategory(category: Category): Promise<any> {
    return this.categoryRef.add(category);
  }

  deleteCategory(id: string): Promise<any> {
    return this.categoryRef.doc(id).delete()
  }

  getCategory(id: string): AngularFirestoreDocument<any> {
    return this.categoryRef.doc(id);
  }

}
