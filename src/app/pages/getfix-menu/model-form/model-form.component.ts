import { Component } from '@angular/core';
import { NbWindowRef } from '@nebular/theme';
import { BrandService } from '../../../services/brand.service';
import { Observable } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { environment } from '../../../../environments/environment'
import { CommonService } from '../../../services/common.service';
import { AngularFireUploadTask } from '@angular/fire/storage';

@Component({
  selector: 'ngx-model-form',
  templateUrl: './model-form.component.html',
  styleUrls: ['./model-form.component.scss']
})
export class ModelFormComponent {
  public model: any;
  public modelModified: any;
  public uploadPercent: Observable<number>;
  public urlImage: Observable<string>;
  public imageSrc: any;
  public imageEdit: any;
  public modelActive: boolean;
  public newImageName: string = 'Select a Image...';
  public color1: string = '#2889e9';

  modelForm = this.fb.group({
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
    this.model = this.windowRef.config.context;
    this.modelModified = this.windowRef.config.context;
    this.modelActive = this.model.active;
    this.modelForm.patchValue({
      ...this.model,
    })
    console.log(this.model.categoriesId)

  }

  onSubmit() {
    // console.log(this.brand)
    // console.log("submit", brand.form.value)
    // console.log("submit", brand.value)
    const id = Math.random().toString(36).substring(2);
    var file = null;
    var filePath = null;
  

    if (this.model.id && !this.imageEdit) {
      console.log("-------------------Actualizando [BRAND] sin imagen-------------------");
      
      return;
    }

    if (this.imageEdit) {
      file = this.imageEdit;
      filePath = this.model.id ? environment.uploadPath.brand + this.model.id : environment.uploadPath.brandBackup + id;
      var task: AngularFireUploadTask;
      if (this.model.id) {
        console.log("-------------Actualizando [BRAND] con Imagen");


        return;
      }

      if (!this.model.id) {
        console.log("--------------Creandooo [BRAND] ------------");


        // console.log("Creandooo...", this.imageEdit)
        console.log("brandForm", this.modelForm)
        return;
      }
    }
  }
  readURL(event): void {
    let file = event; // <--- File Object for future use.
    this.newImageName = file ? file.name : 'Select a Image...';
    this.modelForm.controls['image'].setValue(file ? file.name : ''); // <-- Set Value for Validation
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
  close() {
    this.windowRef.close();
  }
  cancel() {
    this.windowRef.close();

    this.model = this.modelModified;
    console.log(this.modelModified)

    console.log(this.model)

  }
  toggle(event) {
    this.modelActive = event;
  }
  onEventLog(event: string, data: any): void {
    console.log(event, data);
  }

  onChangeColor(color: string): void {
    console.log('Color changed:', color);
  }

}
