import { Component } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import { NbWindowRef } from '@nebular/theme';
import { Course } from '../../../models/course';
import { CategoryService } from '../../../services/category.service';
import { FormatWidth } from '@angular/common';

@Component({
  selector: 'ngx-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrls: ['./manage-form.component.scss']
})
export class ManageFormComponent {

  public course: Course;
  public categoriesByCourse: Array<any> = [];
  public courseActive: boolean;
  a = new FormArray([]);

  courseForm = this.fb.group({
    name: ['', Validators.required],
    active: [false, Validators.required],
    categoryId: ['', Validators.required],
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
    this._categoryService.getCategoriesList().get()
      .subscribe(categories => {
        categories.forEach(category => {
          this.categoriesByCourse.push({ id: category.id, ...category.data() });
          // console.log(category.data())
        })
      })
  }

  get questions() {
    return this.courseForm.get('questions') as FormArray;
  }

  // get answers() {
  //   return this.questions.controls;
  // }

  nada() {
    console.log("nada")
  }

  removeCourse(i) {
    this.questions.removeAt(i);
  }
  toggle(event) {
    this.courseActive = event;
  }

  toggleChange(event, control) {
    console.log(event, control)
  }

  onChange(ev) {
    console.log(ev)
  }

  close() {
    this.windowRef.close();
  }

  cancel() {
    this.windowRef.close();
  }
  onSubmit() {
    console.log(this.courseForm)
  }
}
