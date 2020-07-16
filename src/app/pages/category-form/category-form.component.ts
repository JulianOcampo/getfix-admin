import { Component } from '@angular/core';
import { NbWindowRef } from '@nebular/theme';
import { CategoryService } from '../../services/category.service';
import { finalize } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms'
import { CommonService } from '../../services/common.service';

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
  Form: any;
  profileArray = new FormArray([])
  a = {
    name: "julian"
  };
  profileForm = this.fb.group({
    firstName: ['julian'],
    lastName: ['']
  })
  // profileForm = new FormGroup({
  //   firstName: new FormControl('julian'),
  //   lastName: new FormControl(''),
  // });
  // categoryForm = new FormGroup({
  //   firstName: new FormControl(''),
  //   lastName: new FormControl(''),
  // });
  constructor(
    public windowRef: NbWindowRef,
    private fb: FormBuilder,
    private _categoryService: CategoryService,
    private _commonService: CommonService,
  ) {


    if (this.windowRef.config.context) {
      this.category = this.windowRef.config.context;
      this.categoryModified = this.windowRef.config.context;
      // if (this.category.active)
      this.categoryActive = this.category.active;
      // else this.categoryActive = false;

      this.profileForm.patchValue({
        firstName: this.categoryActive
      })
    }
    console.log("this.category", this.category)

  }
  onSubmit3() {
    // TODO: Use EventEmitter with form value
    console.warn(this.profileForm.value);
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
  onSubmit2() {
    console.log("submit2")
  }
  createOrUptade(category) {
    if (this.category)
      console.log(category)
    // this._categoryService.updateCategory()
  }
  onSubmit(category) {
    console.log(this.category)
    console.log("submit", category.form.value)
    const id = Math.random().toString(36).substring(2);
    var file = null;
    var filePath = null;
    if (this.category.id && !this.imageEdit) {
      console.log("Actualizando categoria sin imagen")
      console.log(this.category)
      this._categoryService.updateCategory(this.category.id, category.form.value)
        .then(res => console.log("actualizado de forma correcta", res))
        .catch(err => console.log("error al actualizar", err))
      return;
    }

    if (this.imageEdit) {
      console.log("imageEdit", this.imageEdit)
      file = this.imageEdit;
      filePath = `uploads/categories_${id}`;
      // const ref = this._categoryService.getPathImage(filePath);
      var task = null;
      if (this.category.id) {
        task = this._commonService.uploadImage(filePath, file);
        this.uploadPercent = task.percentageChanges();
        console.log("Actualizando...")
        task.then(x => {
          x.ref.getDownloadURL().then(newImage => {
            this.urlImage = newImage;
            this._categoryService.updateCategory(this.category.id, { image: newImage, ...category.form.value })
              .then(res => console.log("actualizado de forma correcta", res))
              .catch(err => console.log("error al actualizar", err))
            console.log(newImage)
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
            this._categoryService.createCategory({ image: newImage, ...category.form.value })
              .then(res => console.log("actualizado de forma correcta", res))
              .catch(err => console.log("error al actualizar", err))
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
    const filePath = `uploads/categories_${id}`;
    const ref = this._commonService.getPathImage(filePath);
    const task = this._commonService.uploadImage(filePath, file);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL()))
      .subscribe();
    console.log(task)
  }
  readURL(event): void {
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


}
