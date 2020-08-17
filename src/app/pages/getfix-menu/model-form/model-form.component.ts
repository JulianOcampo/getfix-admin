import { Component } from '@angular/core';
import { NbWindowRef } from '@nebular/theme';
import { BrandService } from '../../../services/brand.service';
import { Observable } from 'rxjs';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { environment } from '../../../../environments/environment'
import { CommonService } from '../../../services/common.service';
import { AngularFireUploadTask } from '@angular/fire/storage';
import { Model } from '../../../models/model';
import { ModelService } from '../../../services/model.service';

@Component({
  selector: 'ngx-model-form',
  templateUrl: './model-form.component.html',
  styleUrls: ['./model-form.component.scss']
})
export class ModelFormComponent {
  public model: Model;
  public modelModified: any;
  public uploadPercent: Observable<number>;
  public urlImage: Observable<string>;
  public imageSrc: any;
  public imageEdit: any;
  public modelActive: boolean;
  public newImageName: string = 'Select a Image...';
  public color1: string = '#2889e9';

  control = this.fb.control([
    'some', 'value'
  ])

  skills = this.fb.array(['melo']);
  group = this.fb.group(this.skills)

  public categoriesByModel: Array<any> = [];
  public brandsByModel: Array<any> = [];

  public selectedCountriesControl = new FormControl();

  countries = [
    { name: 'Arizona', abbrev: 'AZ' },
    { name: 'California', abbrev: 'CA' },
    { name: 'Colorado', abbrev: 'CO' },
    { name: 'New York', abbrev: 'NY' },
    { name: 'Pennsylvania', abbrev: 'PA' },
  ];

  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: [''],
    address: this.fb.group({
      street: [''],
      city: [''],
      state: [''],
      zip: ['']
    }),
    aliases: this.fb.array([
      this.fb.group({
        name: [''],
        hexaValue: ['']
      })
      // this.fb.control('')
    ])
  });

  modelForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    image: ['', Validators.required],
    active: [false, Validators.required],
    categoryId: [''],
    categoryName: [''],
    brandName: [''],
    brandId: [''],
    colors: this.fb.array([
      // this.fb.group({
      //   name: [''],
      //   hexaValue: ['']
      // })
    ]),
    issues: this.fb.array([
      // this.fb.group({
      //   id: [''],
      //   title: [''],
      //   description: [''],
      //   price: [200],
      //   active: [true],
      // })
    ])
  })

  constructor(
    private windowRef: NbWindowRef,
    private fb: FormBuilder,
    private _brandService: BrandService,
    private _modelService: ModelService,
    private _categoryService: CategoryService,
    private _commonService: CommonService,
  ) {
    
    var modelWithType = Object.assign(new Model(), this.windowRef.config.context);
    console.log("-------------------", this.windowRef.config.context[0])
    console.log("----------------------", modelWithType[0])
    // console.log(modelWithType)
    this.model = modelWithType[0];
    // console.log(this.model)
    this.modelModified = this.windowRef.config.context;
    this.modelActive = this.model.active;
    this.modelForm.patchValue({
      name: this.model.name,
      description: this.model.description,
      image: this.model.image,
      categoryId: this.model.categoryId,
      categoryName: this.model.categoryName,
      brandId: this.model.brandId,
      brandName: this.model.brandName,
      active: this.model.active,
    })
    if (this.model.colors) {
      this.model.colors.forEach(val => {
        this.colors.push(this.fb.group({
          name: [val.name],
          hexaValue: [val.hexaValue]
        }))
      });
    }
    if (this.model.issues) {
      this.model.issues.forEach(val => {
        this.issues.push(this.fb.group({
          id: [val.id],
          title: [val.title],
          description: [val.description],
          price: [val.price],
          active: [val.active],
        }))
      });
    }
    this.getCategoriesByModel();
    this.getBrandsByModel(this.model.categoryId);

    console.log(this.modelForm)

  }

  get colors() {
    return this.modelForm.get('colors') as FormArray;
  }
  get issues() {
    return this.modelForm.get('issues') as FormArray;
  }

  addIssue() {
    this.issues.push(this.fb.group({
      id: ['ojojojojoijojojojo'],
      title: [''],
      description: [''],
      price: [100],
      active: [false],
    }))
  }

  addColor() {
    this.colors.push(this.fb.group({
      name: [''],
      hexaValue: ['']
    }))
  }
  resetColor() {
    this.colors.reset();
    if (this.model.colors) {
      this.model.colors.forEach(val => {
        this.colors.push(this.fb.group({
          name: [val.name],
          hexaValue: [val.hexaValue]
        }))
      });
    }
  }

  removeColor(index, data) {
    this.colors.removeAt(index)
  }
  removeIssue(index, data) {
    this.issues.removeAt(index)
  }
  get aliases() {
    return this.profileForm.get('aliases') as FormArray;
  }

  addAlias() {
    this.aliases.push(this.fb.group({
      name: ['melo '],
      hexaValue: ['o no perro']
    }));
  }
  onSubmitest() {
    console.warn(this.profileForm.value);
  }
  remove(index, data) {
    console.log(index, data)
    this.aliases.removeAt(index)
  }


  add() {
    this.skills.push(this.group);
    console.log(this.skills)
  }

  onSubmit() {
    // console.log(this.brand)
    // console.log("submit", brand.form.value)
    // console.log("submit", brand.value)
    const id = Math.random().toString(36).substring(2);
    var file = null;
    var filePath = null;
    let newModel: Model = this.modelForm.value;
    let categoryFilter = this.categoriesByModel.filter(val => val.id == newModel.categoryId);
    let brandFilter = this.brandsByModel.filter(val => val.id == newModel.brandId);

    if (this.model.id && !this.imageEdit) {
      console.log("-------------------Actualizando [BRAND] sin imagen-------------------");
      newModel.categoryName = categoryFilter[0].name;
      newModel.brandName = brandFilter[0].name;
      console.log(this.model.id, newModel)
      this._modelService.updateModel(this.model.id, newModel)
        .then(res => console.log("Actualizado de forma correcta", res))
        .catch(err => console.log("Error al actualizar", err))
      // console.log(this.modelForm)
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
        task = this._commonService.uploadImage(filePath, file)
        task.then(x => {
          x.ref.getDownloadURL().then(newImage => {
            this.urlImage = newImage;
            // console.log("newImage", newImage)
            console.log("Creandooo...", this.imageEdit)
            newModel.image = newImage;
            newModel.categoryName = categoryFilter[0].name;
            newModel.brandName = brandFilter[0].name;
            // console.log(newModel)
            // console.log("{ image: newImage, ...this.categoryForm.value }", { image: newImage, ...this.modelForm.value })
            this._modelService.createModel({ ...newModel })
              .then(res => console.log("actualizado de forma correcta", res))
              .catch(err => console.log("error al actualizar", err))
          })
        })

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
    // console.log(this.modelModified)

    // console.log(this.model)

  }
  toggle(event) {
    this.modelActive = event;
  }
  onEventLog(event: string, data: any, i?: number, name?: string): void {
    // console.log(event, data);

    if (event === 'colorPickerClose') {

      console.log(this.colors)
      this.colors.setControl(i, this.fb.group({
        hexaValue: [data],
        name: [name],
      }))
      console.log(this.colors)

    }

  }

  onChangeColor(color: string): void {
    console.log('Color changed:', color);
  }

  getCategoriesByModel() {
    this._categoryService.getCategoriesList().get()
      .subscribe(categories => {
        categories.forEach(category => {
          this.categoriesByModel.push({ id: category.id, ...category.data() });
          // console.log(category.data())
        })
      })
  }

  getBrandsByModel(categoryId: string) {
    this.brandsByModel = this.brandsByModel.filter(data => false);
    this.modelForm.controls['brandId'].reset();

    this._brandService.getBrandByModel(categoryId).get()
      .subscribe(brands => {
        brands.forEach(brand => {
          this.brandsByModel.push({ id: brand.id, ...brand.data() })
          this.modelForm.patchValue({
            brandId: this.model.brandId,
            brandName: this.model.brandName,
          })
        })
      })
    this.modelForm.patchValue({
      brandId: this.model.brandId
    })
  }
  compareFn(c1: any, c2: any): boolean {
    console.log("**************", c1)
    console.log("**************", c2)
    console.log("**************", c1.id && c2 ? c1.id === c2 : c1 === c2)

    return true;
  }

  onChange(ev) {
    this.getBrandsByModel(ev)
    console.log(ev)
  }

}
