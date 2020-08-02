import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Course } from '../models/course';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private refPath = environment.firebaseRef.course;
  private courseRef: AngularFirestoreCollection<Course>

  constructor(
    private db: AngularFirestore,
  ) {
  }

  getCourse(id: string): AngularFirestoreCollection<any> {
    this.courseRef = this.db.collection(this.refPath, ref => ref.where('categoryId', '==', id))
    
    return this.courseRef;
  }


}
