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
  private user: any;
  constructor(
    private db: AngularFirestore,
    private _getfixReqServicie: GetfixRequestsService,
  ) {
    this.userRef = this.db.collection(this.userRefPath);
  }


  getUsersList(): AngularFirestoreCollection<User> {
    return this.userRef;
  }

  getUser2(id: string): AngularFirestoreDocument<any> {
    return this.userRef.doc(id);
  }
  getUser(id: string) {
    this.userRef.doc(id).get()
      .subscribe(
        _user => {
          this.user = { id: _user.id, ..._user.data() }
          console.log(this.user)
          this._getfixReqServicie.getUserHistory(this.user.id).snapshotChanges().pipe(
            map(history =>
              history.map(h =>
                ({ id: h.payload.doc.id, ...h.payload.doc.data() })

              )
            )
          ).subscribe(
            _userHistory => {
              return _userHistory;
              console.log(_userHistory)
            }
          )

        }
      );
  }
  getUser1(id: string): Observable<any> {
    console.log(id)
    return this.observeDocument(this.userRef.doc(id));

  }
  observeDocument(ref: AngularFirestoreDocument<any>): Observable<any> {
    return Observable.create(observable => {
      const unsubscribeFn = observable.next(ref.get().subscribe(val => val.data()))
      return unsubscribeFn;
    })
  }


}

