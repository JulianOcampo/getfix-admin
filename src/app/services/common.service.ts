import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/storage';
import { environment } from '../../environments/environment'


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private task: AngularFireUploadTask;
  private uploadPathAdminProfile = environment.firebaseRef.uploadPathAdminProfile;
  private uploadProfile = environment.firebaseRef.uploadProfile;

  constructor(
    private storage: AngularFireStorage
  ) { }

  uploadImage(path: any, data: any): AngularFireUploadTask {
    return this.storage.upload(path, data);
  }

  async uploadImage2(parentType: any, type: string, refParentId: string, refId?, item?: any, index?: string): Promise<boolean> {
    debugger
    const finalName = this.generateFileName(parentType, type, refParentId, refId, index)
    try {
      this.task = this.storage.upload(finalName, item.totalImage);
      await this.task
        .then(async t => {
          await t.ref.getDownloadURL()
            .then(async urlUpload => {
              item.image = urlUpload;
              delete item.totalImage
            })
        })
      return true;
    } catch (error) {
      return false;
    }
  }

  cleanObjectToUpload(item: any): Promise<boolean> {
    try {
      delete item.totalImage
      return Promise.resolve(true);
    } catch (error) {
      console.error(error)
      return Promise.resolve(false);
    }
  }

  private generateFileName(parentType: string, type: string, refParentId: string, refId?: string, index?: string): string {
    var fileName = null;
    if (parentType == 'AdminProfile') {
      fileName = `${this.uploadPathAdminProfile}/${refParentId + this.uploadProfile}/${type + '_' + refParentId}`;

    }

    return fileName;
  }

  getPathImage(path: any): AngularFireStorageReference {
    return this.storage.ref(path);
  }
}
