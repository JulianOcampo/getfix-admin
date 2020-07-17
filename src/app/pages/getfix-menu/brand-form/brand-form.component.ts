import { Component } from '@angular/core';
import { NbWindowRef } from '@nebular/theme';
import { BrandService } from '../../../services/brand.service';
import { Observable } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CategoryService } from '../../../services/category.service';
import { environment } from '../../../../environments/environment'
import { CommonService } from '../../../services/common.service';
import { AngularFireUploadTask } from '@angular/fire/storage';




@Component({
  selector: 'ngx-brand-form',
  templateUrl: './brand-form.component.html',
  styleUrls: ['./brand-form.component.scss']
})
export class BrandFormComponent {

  public brand: any;
  public brandModified: any;
  public uploadPercent: Observable<number>;
  public urlImage: Observable<string>;
  public imageSrc: any;
  public imageEdit: any;
  public brandActive: boolean;
  public newImageName: string = 'Select a Image...';

  public color1: string = '#2889e9';

  availablecategories: Array<any> = [];

  selectcategories: Array<any> = [];

  brandForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    image: ['', Validators.required],
    active: [false, Validators.required],
  })
  constructor(
    private windowRef: NbWindowRef,
    private fb: FormBuilder,
    private _brandService: BrandService,
    private _categoryService: CategoryService,
    private _commonService: CommonService,
  ) {
    this.brand = this.windowRef.config.context;
    this.brandModified = this.windowRef.config.context;
    this.brandActive = this.brand.active;
    this.brandForm.patchValue({
      ...this.brand,
    })
    console.log(this.brand.categoriesId)

    this._categoryService.getCategoriesList().get()
      .subscribe(categories => {
        categories.forEach(category => {
          if (this.brand.categoriesId && this.brand.categoriesId.includes(category.id))
            this.selectcategories.push({ id: category.id, name: category.data().name })
          else
            this.availablecategories.push({ id: category.id, name: category.data().name })
        })
        console.log("this.selectcategories", this.selectcategories, "this.availablecategories", this.availablecategories, "this.brand.categoriesId", this.brand.categoriesId);
      })
    // this.selectBrands = this.brand.categoriesId
    //   .map(x =>
    //     ({
    //       id: x.slice(0, x.indexOf(":*")),
    //       name: x.slice(x.indexOf(":*") + 2)
    //     }));
  }

  close() {
    this.windowRef.close();
  }

  cancel() {
    this.windowRef.close();

    this.brand = this.brandModified;
    console.log(this.brandModified)

    console.log(this.brand)

  }
  onSubmit2(a) {
    console.log("submit2", a)
  }

  createOrUptade(brand) {
    if (this.brand)
      console.log(brand)
    // this._brandService.updatebrand()
  }
  onSubmit() {
    // console.log(this.brand)
    // console.log("submit", brand.form.value)
    // console.log("submit", brand.value)
    const id = Math.random().toString(36).substring(2);
    var file = null;
    var filePath = null;
    var selectedCategories = this.selectcategories
      .map(x => x.id);
    var data = {
      ...this.brandForm.value,
      categoriesId: selectedCategories
    }

    if (this.brand.id && !this.imageEdit) {
      console.log("-------------------Actualizando [BRAND] sin imagen-------------------");
      console.log("this.brand.id, data", this.brand.id, data)
      this._brandService.updateBrand(this.brand.id, data)
        .then(res => console.log("Actualizado de forma correcta", res))
        .catch(err => console.log("Error al actualizar", err))
      return;
    }

    if (this.imageEdit) {
      file = this.imageEdit;
      filePath = this.brand.id ? environment.uploadPath.brand + this.brand.id : environment.uploadPath.brandBackup + id;
      var task: AngularFireUploadTask;
      if (this.brand.id) {
        console.log("-------------Actualizando [BRAND] con Imagen");
        task = this._commonService.uploadImage(filePath, file);
        this.uploadPercent = task.percentageChanges();
        task.then(t => {
          t.ref.getDownloadURL()
            .then(newImage => {
              console.log("newImage", newImage)
              this.urlImage = newImage;
              let newBrand = this.brandForm.value;
              newBrand.image = newImage;
              this._brandService.updateBrand(this.brand.id, { ...newBrand, categoriesId: selectedCategories })
                .then(res => console.log("Actualizado de forma correcta", res))
                .catch(err => console.log("Error al actualizar", err))
            })
        })
        return;
      }

      if (!this.brand.id) {
        console.log("--------------Creandooo [BRAND] ------------");
        task = this._commonService.uploadImage(filePath, file)
        task.then(x => {
          x.ref.getDownloadURL().then(newImage => {
            this.urlImage = newImage;
            console.log("newImage", newImage)
            console.log("Creandooo...", this.imageEdit)
            let newCategory = this.brandForm.value;
            newCategory.image = newImage;
            // console.log("{ image: newImage, ...this.categoryForm.value }",{ image: newImage, ...this.categoryForm.value })
            this._brandService.createBrand({ ...newCategory, categoriesId: selectedCategories })
              .then(res => console.log("actualizado de forma correcta", res))
              .catch(err => console.log("error al actualizar", err))
          })
        })
        // console.log("Creandooo...", this.imageEdit)
        console.log("brandForm", this.brandForm)

        return;
      }
    }
  }

  onUploadImage(ev) {
    console.log(ev)
  }

  readURL(event): void {
    let file = event; // <--- File Object for future use.
    this.newImageName = file ? file.name : 'Select a Image...';
    this.brandForm.controls['image'].setValue(file ? file.name : ''); // <-- Set Value for Validation
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
    this.brandActive = event;
  }

  onDrop(event: CdkDragDrop<string[]>) {
    console.log(event)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  public onEventLog(event: string, data: any): void {
    console.log(event, data);
  }


}
