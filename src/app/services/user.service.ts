import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { GetfixRequestsService } from './getfix-requests.service';
import { map } from 'rxjs/operators';
import { Observable, of, observable } from 'rxjs';
import { CloseScrollStrategy } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userRefPath = environment.firebaseRef.user;
  private userRef: AngularFirestoreCollection<User>;
  public users: Array<User> = [];

  constructor(
    private db: AngularFirestore,
    private _getfixReqServicie: GetfixRequestsService,
  ) {
    this.userRef = this.db.collection(this.userRefPath);
  }


  getUsersList(): AngularFirestoreCollection<User> {
    return this.userRef;
  }

  getUser(id: string): AngularFirestoreDocument<any> {
    return this.userRef.doc(id);
  }


}

