import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { WorkerService } from '../../services/worker.service';
import { Worker } from '../../models/worker'
import { Observable } from 'rxjs';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course';

@Component({
  selector: 'ngx-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  public worker: any = undefined;
  public quiz: any = undefined;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _workerService: WorkerService,
    private _courseService: CourseService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      params => {
        console.log(params.categoryId)
        console.log(params.wokerId)
        this._workerService.getWorker(params.wokerId).get()
          .subscribe(_worker => {
            this.worker = _worker.data()
            console.log(this.worker)
          });
        this._courseService.getCourse(params.categoryId).get()
          .subscribe(_course => {
            _course.forEach(_c => {
              this.quiz = _c.data()
              console.log(_c.data())
            })
            console.log(this.quiz)

          })
      })

  }





}
