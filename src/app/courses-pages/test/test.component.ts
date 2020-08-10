import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Routes,Router } from '@angular/router'
import { WorkerService } from '../../services/worker.service';
import { Worker } from '../../models/worker'
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course';
import { TimerService } from '../../services/timer.service';
import { getLocaleTimeFormat } from '@angular/common';
import { FormBuilder, FormArray } from '@angular/forms'
import {  } from '@angular/router';
@Component({
  selector: 'ngx-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  public worker: any = undefined;
  public quiz: any = undefined;
  public questionPage: number = 0;
  public time: string;
  public timerHandler: any;


  radioGroupValue = 'Creative Style Sheets'
  questionForm = this.fb.group({
    courseId: [''],
    categoryId: [''],
    workerId: [''],
    courseName: [''],
    duration: ['300000'],
    questionsAndAnswers: this.fb.array([
      // this.fb.group({
      //   question: [''],
      //   answer: [''],
      // }),
    ])
  })

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _workerService: WorkerService,
    private _courseService: CourseService,
    private _timerService: TimerService,
    private fb: FormBuilder,
  ) { 
;
  }


  ngOnInit() {
    this.activatedRoute.params.subscribe(
      params => {
        console.log(params.categoryId)
        console.log(params.wokerId)
        this._workerService.getWorker(params.wokerId).get()
          .subscribe(_worker => {
            this.worker = { workerId: _worker.id, ..._worker.data() }
            console.log(this.worker)
            if (this.worker.cursesAvailablesByCategoriesId.includes(params.categoryId)) {
              console.log('incluye id')
              this.router.navigate([`course/success`], { queryParams: { category: 'dsdsd', worker: 'djosjfosjf' } })
              return;
            } else {
              this._courseService.getCourse(params.categoryId).get()
                .subscribe(_course => {
                  this.quiz = _course.docs[0].data()

                  this.questionForm.patchValue({
                    courseId: _course.docs[0].id,
                    courseName: this.quiz.name,
                    categoryId: this.quiz.categoryId,
                    workerId: this.worker.workerId,
                  })
                  this.quiz.questions.forEach(element => {
                    this.questionsAndAnswers.push(this.fb.group({
                      question: [element.name],
                      answer: [''],
                    }))
                  });
                  console.log(_course.docs[0].data())

                })
            }
          });


      })
  }

  get questionsAndAnswers() {
    return this.questionForm.get('questionsAndAnswers') as FormArray;
  }

  getTime() {
    let start = Date.now();
    this.timerHandler = setInterval(() => {
      this._timerService.setTime(start);
      this.time = this._timerService.getTime();
    }, 1000);
  }

  stopTime() {
    clearInterval(this.timerHandler);
  }

  valueChange($ev) {
    console.log($ev)
  }
  onSubmit() {
    console.log(this.worker)
    console.log(this.questionForm.value)
    this._courseService.sendCourseResult(this.questionForm.value).subscribe(
      response => {
        console.log(response)
        // this.router.navigate([`${response.body.categoryId}/worker/${response.body.workerId}/success`])
        this.router.navigate([`course/success`], { queryParams: { category: 'dsdsd', worker: 'djosjfosjf' } })
      }
    )
  }

 

}
