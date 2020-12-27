import { Component, OnInit, Optional, TemplateRef, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, Validators } from '@angular/forms';
import { NbAuthService, NbAuthToken } from '@nebular/auth';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Admin } from '../../../models/admin';
import { CustomValidators } from '../../../models/custom-validators';
import { AdminService } from '../../../services/admin.service';
import { CommonService } from '../../../services/common.service';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'ngx-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  queries: {
    dialog: new ViewChild("dialog"),
    dialogCredentials: new ViewChild("dialogCredentials")
  },
})
export class InfoComponent implements OnInit {

  backgroundImage: string = 'assets/getFix/Images/getfix.png';
  adminImage: string = 'assets/getFix/Images/profile-without-image.png';
  userToken$: Observable<NbAuthToken>;
  isAuthenticated$: Observable<boolean>;
  adminInfo: Admin = new Admin();
  titleHeader: string = 'Bienvenido';
  dialog: TemplateRef<any>;
  dialogCredentials: TemplateRef<any>;
  saveSuccess = false;
  resUpload: Array<Promise<boolean>> = [];
  _profileValueTemp: any = {};
  doingSomething: boolean = false;

  profileForm = this.fb.group({
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    image: [''],
    totalImage: [File],
    email: ['', Validators.required],
    phoneNumber: ['', Validators.required]
  })

  credentialsForm = this.fb.group({
    email: ['', Validators.required],
    oldPassword: [null, Validators.compose([Validators.required])],
    newPassword: [null, Validators.compose([
      Validators.required,
      Validators.minLength(6)
    ])],
    confirmNewPassword: [null, Validators.compose([Validators.required])]
  }, {
    validators: CustomValidators.passwordMatchValidator
  })

  constructor(
    private authService: NbAuthService,
    private authFire: AngularFireAuth,
    private _localStorage: LocalStorageService,
    private _adminService: AdminService,
    private _dialogService: NbDialogService,
    @Optional() protected _dialogRef: NbDialogRef<any>,
    @Optional() protected _dialogCredentialsRef: NbDialogRef<any>,
    private fb: FormBuilder,
    private _commonService: CommonService,
    private _toastrService: NbToastrService,

  ) { }

  ngOnInit(): void {
    this.getAdminInfo();
  }

  showToast(message, position, status) {
    this._toastrService.show(
      status || 'Success',
      `Resultado: ${message}`,
      { position, status });
  }

  getAdminInfo() {
    this.adminInfo = this._localStorage.getAdminItem('admin_info')
    if (this.adminInfo) {
      if (this.adminInfo.image) {
        this.adminImage = this.adminInfo.image != '' ? this.adminInfo.image : this.adminImage;
      }
    }
  }

  readURL(event) {
    console.log(event.files[0])
    console.log(event.id)
    const id = event.id.split('_');
    const prop = id[0];
    var img: any;
    if (event.files[0]) {
      const file: File = event.files[0];
      const reader = new FileReader();
      if (prop == 'profileImage') {
        reader.onload = e => {
          img = reader.result;
          this.profileForm.patchValue({
            image: img,
            totalImage: file
          });
          console.log(img)
        }
        reader.readAsDataURL(file);
      }
    }
  }

  selectInputFile(ev) {
    var inputFileElement: HTMLElement = document.querySelector(`#${ev}`);
    inputFileElement.click();
  }

  openEditProfile(dialog: TemplateRef<any>) {
    if (this.adminInfo) {
      this.profileForm.patchValue({
        name: this.adminInfo.name,
        lastName: this.adminInfo.lastName,
        image: this.adminInfo.image,
        email: this.adminInfo.email,
        phoneNumber: this.adminInfo.phoneNumber
      })
    }
    this._dialogRef = this._dialogService.open(dialog, { closeOnBackdropClick: true, closeOnEsc: true, context: { title: 'Editar perfil' } });
  }

  closeEditProfile() {
    this._dialogRef.close();
  }
  closeEditCredentials() {
    this._dialogCredentialsRef.close();
  }

  updateCredentials() {
    console.log(this.credentialsForm)
    firebase.auth().signInWithEmailAndPassword(this.credentialsForm.value.email, this.credentialsForm.value.oldPassword)
      .then((user) => {
        // Signed in
        console.log(user)
        return user.user.updatePassword(this.credentialsForm.value.newPassword)
      }).then(data => {
        this.showToast(`${this.adminInfo.name} credenciales actualizadas con exito!`, 'top-right', 'success');
        console.log(data)
      })
      .catch((error) => {
        this.showToast(`${this.adminInfo.name} autenticacion erronea, intente de nuevo!`, 'top-right', 'danger');

        console.log(error)
      });

  }
  editAdminProfile(ev) {
    this.openEditProfile(this.dialog)
  }

  editAdminCredentials(ev) {
    if (this.adminInfo) {
      this.credentialsForm.patchValue({
        email: this.adminInfo.email,
      })
    }
    this._dialogCredentialsRef = this._dialogService.open(this.dialogCredentials, { closeOnBackdropClick: true, closeOnEsc: true, context: { title: 'Editar credenciales' } });
  }

  updateProfile() {
    this.doingSomething = true;
    var response: Promise<boolean>;
    this._profileValueTemp = Object.assign({}, this.profileForm.value);
    this.resUpload = [];
    if (this._profileValueTemp.image.includes('data:image')) {
      response = this._commonService.uploadImage2('AdminProfile', 'profileImage', this.adminInfo.adminId, '', this.profileForm.value);
      this.resUpload.push(response);
    } else {
      response = this._commonService.cleanObjectToUpload(this.profileForm.value);
      this.resUpload.push(response)
    }

    Promise.all(this.resUpload)
      .then(async res => {
        if (res.includes(false) || res.length == 0 || !this.adminInfo.adminId)
          throw new Error('No se pudo subir imagen')

        var resUpdateProfile = await this._adminService.updateAdminProfile(this.adminInfo.adminId, this.profileForm.value)
        if (resUpdateProfile)
          return true;
        else return false;
      })
      .then((data) => {
        if (data) {
          this.doingSomething = false;
          console.log('Guardado con Exito')
          this.adminInfo = this._localStorage.getAdminItem('admin_info')
          this.showToast(`${this.adminInfo.name} actualizado con exito!`, 'top-right', 'success');
          this.saveSuccess = true;
          this._dialogRef.close();
        } else
          throw new Error('Algo salio mal')
      })
      .catch(error => {
        console.error(error)
        var message = 'error';
        if (error.code) {
          if (error.code.includes('too-many-requests')) {
            message = ' demaciados intentos fallidos, intente mas tarde!'
          } else if (error.code.includes('wrong')) {
            message = ' autenticacion dallida, intente de nuevo!'
          }
        }
        this.showToast(`${this.adminInfo.name + message}`, 'top-right', 'danger');
        this.doingSomething = false;
      })
  }




  hola() {
    firebase.auth().signInWithEmailAndPassword('admin@appchill.co', '12345678')
      .then((user) => {
        // Signed in
        console.log(user)
        user.user.updatePassword('Passw0rd!')
          .then(data => {
            console.log(data)
          })
          .catch(err => {
            console.log(err)
          });

      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
      });

    // const credential = firebase.auth.EmailAuthProvider.credential('admin@appchill.co', '87654321');
    // var user = firebase.auth().currentUser;
    // console.log(user)
    // user.reauthenticateWithCredential(credential).then(function (data) {
    //   // User re-authenticated.
    //   console.log(data)
    // }).catch(function (error) {
    //   // An error happened.
    //   console.log(error)
    // });

    // setTimeout(async () => {

    //   await (await this.authFire.currentUser).updatePassword('Passw0rd!')
    //     .then(data => {
    //       console.log(data)
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     });
    // }, 100);

  }
}
