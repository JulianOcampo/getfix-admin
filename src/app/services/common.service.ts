import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/storage';
import { environment } from '../../environments/environment'


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private storage: AngularFireStorage

  ) { }

  uploadImage(path: any, data: any): AngularFireUploadTask {
    return this.storage.upload(path, data);
  }

  getPathImage(path: any): AngularFireStorageReference {
    return this.storage.ref(path);
  }
}
