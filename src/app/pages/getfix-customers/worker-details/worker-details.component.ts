import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { first, map } from 'rxjs/operators';
import { OrderRequesDocument } from '../../../models/order-request-document';
import { GetfixRequestsService } from '../../../services/getfix-requests.service';
import { WorkerService } from '../../../services/worker.service';
import { Worker } from '../../../models/worker'
import { CourseService } from '../../../services/course.service';
import { CourseResult } from '../../../models/courseResult';
@Component({
  selector: 'ngx-worker-details',
  templateUrl: './worker-details.component.html',
  styleUrls: ['./worker-details.component.scss']
})
export class WorkerDetailsComponent implements OnInit {
  public worker: Worker = new Worker();
  source: LocalDataSource = new LocalDataSource();
  sourceCourses: LocalDataSource = new LocalDataSource();
  loading: boolean = false;
  settings = {
    mode: 'external',
    title: 'Models',
    actions: {
      add: false,
      delete: false,
      // position: 'right'
    },
    // add: {
    //   addButtonContent: '<i class="nb-plus"></i>',
    // },
    edit: {
      editButtonContent: '<i class="nb-search"></i>',
    },
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash "></i>',
    //   confirmDelete: true,
    // },
    columns: {
      userFullName: {
        title: 'User',
        type: 'text',
        width: '30%',
      },
      categoryType: {
        title: 'Category',
        type: 'text',
        width: '25%',
      },
      brandType: {
        title: 'Brand',
        type: 'text',
        width: '25%',
      },
      totalPrice: {
        title: 'Total Price',
        type: 'text',
        width: '20%',
      },
    },
  };

  settingsCourses = {
    mode: 'external',
    title: 'Models',
    actions: {
      add: false,
      delete: false,
      // position: 'right'
    },
    // add: {
    //   addButtonContent: '<i class="nb-plus"></i>',
    // },
    edit: {
      editButtonContent: '<i class="nb-search"></i>',
    },
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash "></i>',
    //   confirmDelete: true,
    // },
    columns: {
      categoryName: {
        title: 'Category',
        type: 'text',
        width: '30%',
      },
      courseName: {
        title: 'Course Name',
        type: 'text',
        width: '25%',
      },
      score: {
        title: 'Score',
        type: 'text',
        width: '25%',
      },
      courseStateText: {
        title: 'State',
        type: 'text',
        width: '20%',
      },
    },
  };


  constructor(
    private activatedRoute: ActivatedRoute,
    private _workerService: WorkerService,
    private _getfixReqService: GetfixRequestsService,
    private _courseService: CourseService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      params => {
        this._workerService.getWorker(params.id).get()
          .pipe(
            map(changes => {
              return { id: changes.id, ...Object.assign(new Worker, changes.data()) }
            })
          )
          .subscribe(
            _worker => {
              this.worker = _worker;
              this._getfixReqService.getWorkerHistory(this.worker.id).get().pipe(
                first(),
                map(history => history.docs.map(h =>
                ({
                  id: h.id,
                  userFullName: h.data().user.fullName,
                  totalPrice: h.data().serviceRepair.totalPrice,
                  brandType: h.data().serviceRepair.brandType,
                  categoryType: h.data().serviceRepair.categoryType,
                  ...Object.assign(new OrderRequesDocument, h.data())
                })))
              ).subscribe(
                history => {
                  console.log(history)
                  this.source.load(history);
                  this.source.setPaging(1, 5);
                }
              )
            }

          )

        console.log(params)
      }
    )
  }
  onDetails(_event) {
    console.log(event)
  }
  changeTab(_event) {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 200);
    if (_event.tabTitle == 'Information') {
      this._courseService.getCourseListByWorker(this.worker.id).get()
        .pipe(
          first(),
          map(courses => courses.docs.map(c => {
            return { id: c.id, ...Object.assign(new CourseResult, c.data()) }
          }))
        ).subscribe(_courseResult => {
          _courseResult.map(val => {
            val.courseStateText = val.courseState == 1 ? 'passed' : 'missed';
            val.score = +val.score.toFixed(2);
            return { ...val }
          })

          this.sourceCourses.load(_courseResult)
          this.sourceCourses.setPaging(1, 5)
        })
    }


    console.log(_event)
  }
}
