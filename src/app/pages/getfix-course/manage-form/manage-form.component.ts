import { Component } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import { NbToastrService, NbWindowRef } from '@nebular/theme';
import { Course } from '../../../models/course';
import { CategoryService } from '../../../services/category.service';
import { FormatWidth } from '@angular/common';
import { first } from 'rxjs/operators';
import { CourseService } from '../../../services/course.service';
import { Category } from '../../../models/category';

@Component({
  selector: 'ngx-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrls: ['./manage-form.component.scss']
})
export class ManageFormComponent {

  public course: Course;
  public categoriesByCourse: Array<Category> = [];
  public courseActive: boolean;
  doingSomething: boolean = false;
  a = new FormArray([]);

  courseForm = this.fb.group({
    name: ['', Validators.required],
    active: [false, Validators.required],
    categoryId: ['', Validators.required],
    categoryName: [''],
    categoryImage: [''],
    questions: this.fb.array([
      // this.fb.group({
      //   name: ['test', Validators.required],
      //   answers: this.fb.array([
      //     this.fb.group({
      //       isAnswer: [true],
      //       name: ['test']
      //     })
      //   ]),
      // })
    ])
  })

  constructor(
    private windowRef: NbWindowRef,
    private fb: FormBuilder,
    private _categoryService: CategoryService,
    private _couseService: CourseService,
    private _toastrService: NbToastrService,

  ) {
    var courseWithType = Object.assign(new Course(), this.windowRef.config.context);
    console.log("-------------------", this.windowRef.config.context[0])
    console.log("----------------------", courseWithType[0])
    this.course = courseWithType[0];
    // console.log(courseWithType)
    console.log(this.course)
    this.courseActive = this.course.active;

    this.courseForm.patchValue({
      name: this.course.name,
      active: this.course.active,
      categoryId: this.course.categoryId,
      categoryName: this.course.categoryName,
      categoryImage: this.course.categoryImage
    })
    if (this.course.questions) {
      this.course.questions.forEach((val, i) => {

        this.questions.push(this.fb.group({
          name: val.name,
          answers: new FormArray([])
        }))
        let answerTemp = this.questions.controls[i].get('answers') as FormArray;
        val.answers.forEach(ans => {
          answerTemp.push(this.fb.group({
            name: ans.name,
            isAnswer: ans.isAnswer
          }))
        })

      })
    }
    this.getCategoriesByCourse();
  }

  getCategoriesByCourse() {
    this.doingSomething = true;
    this._categoryService.getCategoriesList().get()
      .subscribe(categories => {
        categories.forEach(category => {
          this.categoriesByCourse.push({ id: category.id, ...category.data() });
          this.doingSomething = false;
        })
      })
  }

  get questions() {
    return this.courseForm.get('questions') as FormArray;
  }

  // get answers() {
  //   return this.questions.controls;
  // }

  addElement(element) {
    const id = element.id.split('_');
    const prop = id[0];
    const index = id[1] ? id[1] : null;
    if (prop == 'addCourse') {
      this.questions.insert(0, this.fb.group({
        name: ['new question', Validators.required],
        answers: this.fb.array([
          this.fb.group({
            isAnswer: [false],
            name: ['answer 1']
          }), this.fb.group({
            isAnswer: [false],
            name: ['answer 2']
          }), this.fb.group({
            isAnswer: [false],
            name: ['answer 3']
          }), this.fb.group({
            isAnswer: [false],
            name: ['answer 4']
          })
        ]),
      }))
    } else if (prop == 'addAnswer' && index) {
      var answer = this.questions.controls[index].get('answers') as FormArray;
      answer.insert(0, this.fb.group({
        isAnswer: [false],
        name: ['new answer']
      }))

    }
  }

  removeElement(event) {
    const id = event.id.split('_');
    const prop = id[0];
    const index = id[1];
    const index2 = id[2] ? id[2] : null;
    if (prop == 'removeQuestion' && index) {
      if (window.confirm(`Are you shure to delete question #: ${+index + 1} ?`)) {
        this.questions.removeAt(+index);
      }
    }
    else if (prop == 'removeAnswer' && index && index2) {
      var answers = this.questions.controls[+index].get('answers') as FormArray;
      answers.removeAt(+index2);
    }

  }
  toggle(event) {
    this.courseActive = event;
  }

  toggleChange(event, control) {
    console.log(event, control)
  }

  onChange(categoryId) {
    console.log(categoryId)
    var categorySelected = this.categoriesByCourse.filter(val => val.id == categoryId)
    this.courseForm.patchValue({
      categoryName: categorySelected[0].name,
      categoryImage: categorySelected[0].image
    })
  }

  close() {
    this.windowRef.close();
  }

  cancel() {
    this.windowRef.close();
  }
  onSubmit() {
    console.log(this.courseForm)
    console.log(this.course.id)
    this.doingSomething = true;
    if (this.course.id) {
      console.log('------------------Actualizando curso')
      this._couseService.updateCourse(this.course.id, this.courseForm.value)
        .then(res => {
          this.showToast(`${this.courseForm.value.categoryName} updated!`, 'top-right', 'success');
        })
        .catch(error => {
          this.showToast(`${this.courseForm.value.categoryName} somethig happening, try again!`, 'top-right', 'danger');
        })
        .finally(() => {
          this.doingSomething = false;
          this.windowRef.close();
        })
    } else {
      console.log('------------------Creando curso')
      this._couseService.createCourse(this.courseForm.value)
        .then(data => {
          console.log('curso creado con exito:', data.id)
          this.showToast(`${this.courseForm.value.categoryName} created!`, 'top-right', 'success');
        })
        .catch(eror => {
          this.showToast(`${this.courseForm.value.categoryName} somethig happening, try again!`, 'top-right', 'danger');
        }).finally(() => {
          this.doingSomething = false;
          this.windowRef.close();
        })
    }
  }

  stopDefAction(event) {
    console.log(event.currentTarget.focus)

    // event.preventDefault();
    // event.stopPropagation();
  }

  showToast(message, position, status) {
    this._toastrService.show(
      status || 'Success',
      `Result: ${message}`,
      { position, status });
  }
}
