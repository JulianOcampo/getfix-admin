import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Course } from '../models/course';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { CourseResult } from '../models/courseResult';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from '../services/http-error-handler.service';
@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = environment.firebaseFunctionApi.url;
  private SaveCourseResult = environment.firebaseFunctionApi.saveCourseResult;
  private refPath = environment.firebaseRef.course;
  private workerRefPath = environment.firebaseRef.worker;
  private courseRef: AngularFirestoreCollection<Course>;

  private handleError: HandleError;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }),
  }

  constructor(
    private db: AngularFirestore,
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    this.handleError = httpErrorHandler.createHandleError('HeroesService');
    this.courseRef = this.db.collection(this.refPath, ref => ref.orderBy('name'));

  }

  getCourseList(): AngularFirestoreCollection<Course> {
    return this.courseRef;

  }

  getCourse(id: string): AngularFirestoreCollection<any> {
    this.courseRef = this.db.collection(this.refPath, ref => ref.where('categoryId', '==', id))

    return this.courseRef;
  }

  getScore(workerId: string, categoryId: string): AngularFirestoreCollection<any> {
    return this.db.collection(`${this.workerRefPath + '/' + workerId  + this.refPath}`,
      ref => ref.where('categoryId', '==', categoryId).where('score', '>=', 3))
  }

  sendCourseResult(courseResult: CourseResult): Observable<any> {
    return this.http.post(this.apiUrl + this.SaveCourseResult, { courseInfo: courseResult }, { observe: 'body', ...this.httpOptions })
    // .pipe(
    //   catchError(this.handleError('deleteCourse'))
    // )
  }

}
