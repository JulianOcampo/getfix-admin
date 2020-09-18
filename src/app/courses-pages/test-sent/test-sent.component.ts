import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { WorkerService } from '../../services/worker.service';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'ngx-test-sent',
  templateUrl: './test-sent.component.html',
  styleUrls: ['./test-sent.component.scss']
})
export class TestSentComponent implements OnInit {
  public failedQuiz: number = 0;
  public quizScore: any = '...';
  public worker: any;
  public quiz: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _workerService: WorkerService,
    private _courseService: CourseService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(first()).subscribe(
      params => {
        console.log(params)
        this._workerService.getWorker(params.workerId).get()
          .pipe(first())
          .subscribe(_worker => {
            console.log(_worker.data());
            this.worker = _worker.data();

            this._courseService.getCourse(params.categoryId).get()
              .pipe(first())
              .subscribe(_course => {
                this.quiz = _course.docs[0].data();
                console.log(this.quiz.name)
                if (params.error == "true" && params.score) {
                  this.failedQuiz = 1;
                  this.quizScore = +params.score;
                } else {
                  this.failedQuiz = 2;
                  this._courseService.getScore(params.workerId, params.categoryId).get().pipe(
                    first()
                  ).subscribe(
                    data => {
                      console.log(data.docs[0].data())
                      this.quizScore = +data.docs[0].data().score;

                    }
                  )

                }
              })
          })

      })
  }

}
