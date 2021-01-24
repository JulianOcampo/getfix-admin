import { Component, OnDestroy, OnInit, Optional, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { first, map } from 'rxjs/operators';
import { ServiceRequestDocument } from '../../../models/service-request-document';
import { GetfixRequestsService } from '../../../services/getfix-requests.service';
import { WorkerService } from '../../../services/worker.service';
import { Worker } from '../../../models/worker'
import { CourseService } from '../../../services/course.service';
import { CourseResult } from '../../../models/courseResult';
import { NotifyService } from '../../../services/notify.service';
import { environment } from '../../../../environments/environment';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { WorkerBankStorage } from '../../../models/worker-bank-storage';
@Component({
  selector: 'ngx-worker-details',
  templateUrl: './worker-details.component.html',
  styleUrls: ['./worker-details.component.scss'],
  queries: {
    dialog: new ViewChild("dialog")
  },
})
export class WorkerDetailsComponent implements OnInit, OnDestroy {

  worker: Worker = new Worker();
  workerBankStorage: WorkerBankStorage = new WorkerBankStorage();
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
  suscriptionServiceDetails: any = [];
  suscriptionHistory: any = [];
  suscriptionBankStorage: any = [];
  suscriptionHelper: Array<any> = [];

  saveSuccess: boolean = false;
  saveError: boolean = false;
  dialog: TemplateRef<any>;


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _dialogService: NbDialogService,
    private _toastrService: NbToastrService,
    private _workerService: WorkerService,
    private _getfixReqService: GetfixRequestsService,
    private _courseService: CourseService,
    private _notifyService: NotifyService,
    @Optional() protected _dialogRef: NbDialogRef<any>
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      params => {
        this.suscriptionServiceDetails = this._workerService.getWorker(params.id).snapshotChanges()
          .pipe(
            map(changes => {
              return Object.assign(new Worker, { id: changes.payload.id, ...changes.payload.data() })
            })
          )
          .subscribe(
            _worker => {
              this.worker = _worker;
              this.suscriptionHistory = this._getfixReqService.getWorkerHistory(this.worker.id).get().pipe(
                first(),
                map(history => history.docs.map(h =>
                ({
                  id: h.id,
                  userFullName: h.data().user.fullName,
                  totalPrice: h.data().serviceRepair.totalPrice,
                  brandType: h.data().serviceRepair.brandType,
                  categoryType: h.data().serviceRepair.categoryType,
                  ...Object.assign(new ServiceRequestDocument, h.data())
                })))
              ).subscribe(
                history => {
                  console.log(history)
                  this.source.load(history);
                  this.source.setPaging(1, 5);
                }
              )
              this.suscriptionHelper.push({ subscriber: this.suscriptionHistory })
            }
          )
        this.suscriptionHelper.push({ subscriber: this.suscriptionServiceDetails })
        this.suscriptionBankStorage = this._workerService.getWorkerBankStorage(params.id).snapshotChanges()
          .pipe(
            map(changes => {
              return Object.assign(new WorkerBankStorage, { id: changes.payload.id, ...changes.payload.data() })
            })
          )
          .subscribe(bankStorage => {
            this.workerBankStorage = bankStorage;
          })
      }
    )
  }
  onDetails(_event) {
    this.router.navigate(['/pages/service-request/details/' + _event.id]);

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

  approveWorker() {
    this._dialogRef = this._dialogService.open(this.dialog, { closeOnBackdropClick: false, closeOnEsc: false, context: { title: 'Accepting Worker' } });

    this._workerService.updateWorkerState(this.worker.id, environment.constants.workerStates.busy).toPromise()
      .then(workerStateResponse => {
        console.log(workerStateResponse)
        return this._notifyService.sendMessageToDevice(this.worker.token, environment.constants.notify.workerApproved).toPromise()
      })
      .then(messageResponse => {
        console.log(messageResponse)
        return this._notifyService.sendEmailToUser(this.worker.email, environment.constants.notify.workerApprovedSubject, environment.constants.notify.workerApproved, environment.constants.notify.workerApproved).toPromise()
      })
      .then(emailResponse => {
        console.log(emailResponse)
      })
      .catch(error => {
        console.error(error)
        this.saveError = true;
        setTimeout(() => {
          this._dialogRef.close();
          this.showToast(`${this.worker.fullName} could not be approved!`, 'top-right', 'danger');

        }, 1000);
      })
      .finally(() => {
        this.saveSuccess = true;
        setTimeout(() => {
          this._dialogRef.close();
          this.showToast(`${this.worker.fullName} was approved sucefull!`, 'top-right', 'success');
        }, 1000);
      })
  }
  denyWorker() {
    this._dialogRef = this._dialogService.open(this.dialog, { closeOnBackdropClick: false, closeOnEsc: false, context: { title: 'Denying Worker' } });

    this._workerService.updateWorkerState(this.worker.id, environment.constants.workerStates.denyByAdmin).toPromise()
      .then(workerStateResponse => {
        console.log(workerStateResponse)
        return this._notifyService.sendMessageToDevice(this.worker.token, environment.constants.notify.workerDenied).toPromise()
      })
      .then(messageResponse => {
        console.log(messageResponse)
        return this._notifyService.sendEmailToUser(this.worker.email, environment.constants.notify.workerDeniedSubject, environment.constants.notify.workerDenied, environment.constants.notify.workerDenied).toPromise()
      })
      .then(emailResponse => {
        console.log(emailResponse)
      })
      .catch(error => {
        console.error(error)
        this.saveError = true;
        setTimeout(() => {
          this._dialogRef.close();
          this.showToast(`${this.worker.fullName} could not be denied!`, 'top-right', 'danger');

        }, 1000);
      })
      .finally(() => {
        this.saveSuccess = true;
        setTimeout(() => {
          this._dialogRef.close();
          this.showToast(`${this.worker.fullName} was denied sucefull!`, 'top-right', 'success');
        }, 1000);
      })

  }

  get status() {
    if ((this.worker.avgRating) <= 2) {
      return 'danger';
    } else if (this.worker.avgRating <= 3) {
      return 'warning';
    } else if (this.worker.avgRating <= 4) {
      return 'info';
    } else {
      return 'success';
    }
  }

  showToast(message, position, status) {
    this._toastrService.show(
      status || 'Success',
      `Result: ${message}`,
      { position, status });
  }

  ngOnDestroy() {
    this.suscriptionHelper.forEach(suscription => {
      console.log("abierta", suscription)
      if (suscription.subscriber && !suscription.subscriber.closed) {
        suscription.subscriber.unsubscribe();
        suscription.subscriber.remove;
        console.log("Cerrando suscripciones..: cerrada?", suscription.subscriber.closed)
      }
    });
  }


}
