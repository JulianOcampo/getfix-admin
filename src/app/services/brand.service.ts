import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore'
import { Brand } from '../models/brand';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private refPath = environment.firebaseRef.brand;
  private brandRef: AngularFirestoreCollection<Brand>;

  constructor(
    private db: AngularFirestore,
  ) {
    this.brandRef = this.db.collection(this.refPath);
  }

  getBrandsList(): AngularFirestoreCollection<Brand> {
    return this.brandRef;
  }

  updateBrand(key: string, value: any): Promise<any> {
    return this.brandRef.doc(key).update(value);
  }

  createBrand(brand: Brand): Promise<any> {
    return this.brandRef.add(brand);
  }


}
