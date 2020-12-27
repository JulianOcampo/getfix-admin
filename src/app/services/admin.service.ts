import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private adminRefPath = environment.firebaseRef.admin;

  
  constructor(
    private db: AngularFirestore,
  ) { }

  getAdminInfo(adminId: string): AngularFirestoreDocument<any> {
    return this.db.collection(this.adminRefPath).doc(adminId);
  }

  async updateAdminProfile(adminId: string, adminInfo: any): Promise<boolean> {
    try {
      await this.db.collection(this.adminRefPath).doc(adminId).update(adminInfo);
      return true;
    } catch (error) {
      return false;
    }
  }
}
