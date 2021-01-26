import { Component } from '@angular/core';
import { NbToastrService, NbWindowRef } from '@nebular/theme';
import { finalize } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment'
import { CategoryService } from '../../../services/category.service';
import { CommonService } from '../../../services/common.service';
import { AngularFireUploadTask } from '@angular/fire/storage';


@Component({
  selector: 'ngx-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent {
  public category: any;
  public categoryModified: any;
  public uploadPercent: Observable<number>;
  public urlImage: Observable<string>;
  public imageSrc: any;
  public imageEdit: any;
  public categoryActive: boolean;
  public newImageName: string = 'Select a Image...';
  doingSomething: boolean = false;
  categoryForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    image: ['', Validators.required],
    active: [false],
  })
  constructor(
    private windowRef: NbWindowRef,
    private fb: FormBuilder,
    private _categoryService: CategoryService,
    private _commonService: CommonService,
    private _toastrService: NbToastrService,

  ) {

    this.category = this.windowRef.config.context;
    this.categoryModified = this.windowRef.config.context;

    // if (this.category.active)
    this.categoryActive = this.category.active;
    // else this.categoryActive = false;

    this.categoryForm.patchValue({
      ...this.category
    })

    console.log("this.category", this.category)

  }


  onSubmit3() {
    // TODO: Use EventEmitter with form value
    console.warn(this.categoryForm.value);
  }
  close() {
    this.windowRef.close();
  }
  cancel() {
    this.windowRef.close();

    this.category = this.categoryModified;
    console.log(this.categoryModified)

    console.log(this.category)

  }
  onSubmit2(a) {
    console.log("submit2", a)
  }
  createOrUptade(category) {
    if (this.category)
      console.log(category)
    // this._categoryService.updateCategory()
  }
  onSubmit() {
    this.doingSomething = true;
    console.log(this.category)
    // console.log("submit", category.form.value)
    const id = Math.random().toString(36).substring(2);
    var file = null;
    var filePath = null;
    if (this.category.id && !this.imageEdit) {
      console.log("Actualizando categoria sin imagen")
      console.log(this.category)
      console.log("this.category.id, this.categoryForm.value", this.category.id, this.categoryForm.value)
      this._categoryService.updateCategory(this.category.id, this.categoryForm.value)
        .then(res => {
          console.log("Actualizado de forma correcta", res);
          this.showToast(`${this.categoryForm.value.name} updated!`, 'top-right', 'success');
        })
        .catch(err => {
          console.log("Error al actualizar", err);
          this.showToast(`${this.categoryForm.value.name} somethig happening, try again!`, 'top-right', 'danger');
        })
        .finally(() => {
          this.doingSomething = false;
          this.windowRef.close();
        })
      return;
    }

    if (this.imageEdit) {
      console.log("imageEdit", this.imageEdit)
      file = this.imageEdit;
      filePath = this.category.id ? environment.uploadPath.category + this.category.id : environment.uploadPath.categoryBackup + id;
      // const ref = this._categoryService.getPathImage(filePath);
      var task: AngularFireUploadTask;
      if (this.category.id) {
        task = this._commonService.uploadImage(filePath, file);
        this.uploadPercent = task.percentageChanges();
        console.log("Actualizando...")
        task.then(t => {
          t.ref.getDownloadURL()
            .then(newImage => {
              console.log("newImage", newImage)

              this.urlImage = newImage;
              let newCategory = this.categoryForm.value;
              delete newCategory.image;
              // console.log("this.category.id, { image: newImage, ...this.categoryForm.value}", this.category.id, + "image:" + newImage, ...this.categoryForm.value)
              this._categoryService.updateCategory(this.category.id, { image: newImage, ...newCategory })
                .then(res => {
                  console.log("Actualizado de forma correcta", res);
                  this.showToast(`${this.categoryForm.value.name} updated!`, 'top-right', 'success');
                })
                .catch(err => {
                  console.log("Error al actualizar", err);
                  this.showToast(`${this.categoryForm.value.name} somethig happening, try again!`, 'top-right', 'danger');
                })
                .finally(() => {
                  this.doingSomething = false;
                  this.windowRef.close();
                })
            })
        })
        return;
      }
      if (!this.category.id) {
        task = this._commonService.uploadImage(filePath, file);
        this.uploadPercent = task.percentageChanges();
        task.then(x => {
          x.ref.getDownloadURL().then(newImage => {
            this.urlImage = newImage;
            console.log("newImage", newImage)

            console.log("Creandooo...", this.imageEdit)
            let newCategory = this.categoryForm.value;
            delete newCategory.image;
            // console.log("{ image: newImage, ...this.categoryForm.value }",{ image: newImage, ...this.categoryForm.value })
            this._categoryService.createCategory({ image: newImage, ...newCategory })
              .then(res => {
                console.log("Creado de forma correcta", res);
                this.showToast(`${this.categoryForm.value.name} created!`, 'top-right', 'success');

              })
              .catch(err => {
                console.log("error al actualizar", err);
                this.showToast(`${this.categoryForm.value.name} somethig happening, try again!`, 'top-right', 'danger');
              })
              .finally(() => {
                this.doingSomething = false;
                this.windowRef.close();
              })
          })
        })

        return;
      }
      // task.snapshotChanges().pipe(finalize(() =>   ref.getDownloadURL()))
      //   .subscribe();
      // console.log(task)
    }
  }

  onUploadImage(ev) {
    console.log(ev)
    const id = Math.random().toString(36).substring(2);
    const file = ev;
    const filePath = environment.uploadPath.category + id;
    const ref = this._commonService.getPathImage(filePath);
    const task = this._commonService.uploadImage(filePath, file);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL()))
      .subscribe();
    console.log(task)
  }
  readURL(event): void {
    let file = event; // <--- File Object for future use.
    this.newImageName = file ? file.name : 'Select a Image...';
    this.categoryForm.controls['image'].setValue(file ? file.name : ''); // <-- Set Value for Validation
    console.log(event)
    this.imageEdit = event;
    if (event) {
      const file = event;

      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;

      reader.readAsDataURL(file);
      console.log(this.imageSrc)
    }
  }

  toggle(event) {
    this.categoryActive = event;
  }

  showToast(message, position, status) {
    this._toastrService.show(
      status || 'Success',
      `Result: ${message}`,
      { position, status });
  }



}
