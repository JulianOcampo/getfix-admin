import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { environment } from '../../../environments/environment';
import { CardSettings } from '../../models/card-setting';
import { ServiceRequestDocument } from '../../models/service-request-document';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { WorkerService } from '../../services/worker.service';
import { Worker } from '../../models/worker'
import { User } from '../../models/user';

@Component({
  selector: 'ngx-getfix-dashboard',
  styleUrls: ['./getfix-dashboard.component.scss'],
  templateUrl: './getfix-dashboard.component.html',
})
export class GetfixDashboardComponent implements OnInit {
  const: {
    applications: number,
    workers: number,
    users: number,
    services: number,
    profits: number,
    workersAvailable: number,
    canceledWorker: number,
    canceledUser: number
  } = {
      applications: 0,
      workers: 1,
      users: 2,
      services: 3,
      profits: 4,
      workersAvailable: 5,
      canceledWorker: 6,
      canceledUser: 7,
    }
  settings = {
    mode: 'external',
    title: 'Models',
    actions: {
      add: false,
      delete: false,
    },
    edit: {
      editButtonContent: '<i class="nb-search"></i>',
    },
    columns: {
      date: {
        title: 'Date',
        type: 'text',
        width: '20%',
      },
      userFullName: {
        title: 'User Name',
        type: 'text',
        width: '25%',
      },
      workerFullName: {
        title: 'Worker Name',
        type: 'text',
        width: '25%',
      },
      price: {
        title: 'price',
        type: 'text',
        width: '15%',
      },
    },
    pager: {
      perPage: 10
    }
  };
  source: LocalDataSource = new LocalDataSource();
  statusCards: CardSettings[] = [
    {
      title: 'Job applications:',
      subtitle: '10',
      iconClass: 'nb-compose',
      type: 'primary',
      cardClass: 'mb-1',
      link: '/pages/get-fix-management/workers-pending',
    },
    {
      title: 'Total works:',
      iconClass: 'nb-roller-shades',
      type: 'primary',
      cardClass: 'mb-1',
      link: '/pages/get-fix-customers/workers',
    },
    {
      title: 'Total users:',
      iconClass: 'nb-person',
      type: 'primary',
      cardClass: 'mb-1',
      link: '/pages/get-fix-customers/users',

    },
    {
      title: 'Total services:',
      iconClass: 'nb-e-commerce',
      type: 'primary',
      cardClass: 'mb-1',
      link: '/pages/service-request/all',

    },
    {
      title: 'Profits:',
      iconClass: 'nb-bar-chart',
      type: 'success',
      cardClass: 'mb-1',
      link: '/pages/service-request/all',
    },
    {
      title: 'Workers available:',
      iconClass: 'nb-checkmark-circle',
      type: 'primary',
      cardClass: 'mb-1',
      link: '/pages/get-fix-customers/workers',
    },
    {
      title: 'Services canceled by worker:',
      iconClass: 'nb-close-circled',
      type: 'primary',
      cardClass: 'mb-1',
      link: '/pages/service-request/canceled-by-worker',

    },
    {
      title: 'Services canceled by user:',
      iconClass: 'nb-close-circled',
      type: 'primary',
      cardClass: 'mb-1',
      link: '/pages/service-request/canceled-by-client',
    }
  ]
  constructor(
    private router: Router,
    private _commonService: CommonService,
    public _workerService: WorkerService,
    private _userService: UserService,
  ) { }

  ngOnInit(): void {
    this.source.load(this._commonService.serviceRequestInProgress);

    this.fillWorkersAplications(this._workerService.workersPendingToAccepted);
    this.fillWorkers(this._workerService.workers);
    this.fillUsers(this._userService.users);
    this.fillServicesRequest(this._commonService.serviceRequest);
    this.fillWorkesAvailable(this._workerService.workers)
    this.fillCanceledByWorker(this._commonService.serviceRequestCanceledByWorker)
    this.fillCanceledByUser(this._commonService.serviceRequestCanceledByClient);


    this._commonService.sendServiceRequestInProgressObservable
      .subscribe(serviceRequest => {
        this.source.load(serviceRequest);
      })

    this._workerService.sendWorkersPendingToAcceptedObservable
      .subscribe(workersPending => {
        this.fillWorkersAplications(workersPending);
      })
    this._workerService.sendWorkersObservable
      .subscribe(workers => {
        this.fillWorkers(workers);
        this.fillWorkesAvailable(workers);
      })
    this._userService.sendUsersObservable
      .subscribe(users => {
        this.fillUsers(users);
      })
    this._commonService.sendServiceRequestObservable
      .subscribe(servicesRequest => {
        this.fillServicesRequest(servicesRequest);
      })
    this._commonService.sendServiceRequestCanceledByWorkerObservable
      .subscribe(servicesCanceledByWorker => {
        this.fillCanceledByWorker(servicesCanceledByWorker);
      })
    this._commonService.sendServiceRequestCanceledByClientObservable
      .subscribe(servicesCanceledByClient => {
        this.fillCanceledByUser(servicesCanceledByClient);
      })

  }

  fillWorkersAplications(workers: Worker[]) {
    this.statusCards[this.const.applications].subtitle = workers.length.toString();
    this.statusCards[this.const.applications].type = workers.length > 0 ? 'warning' : 'primary';
  }

  fillWorkers(workers: Worker[]) {
    this.statusCards[this.const.workers].subtitle = workers.length.toString();
  }

  fillUsers(users: User[]) {
    this.statusCards[this.const.users].subtitle = users.length.toString();
  }

  fillServicesRequest(servicesRequest: ServiceRequestDocument[]) {
    this.statusCards[this.const.services].subtitle = servicesRequest.length.toString();
    let profit = 0;
    servicesRequest.forEach(serviceRequest => {
      profit = serviceRequest.serviceRepair.totalPrice + profit;
    })
    this.statusCards[this.const.profits].subtitle = '$ ' + profit.toString();
  }

  fillWorkesAvailable(workers: Worker[]) {
    let workersAvailable = workers.filter(worker => (worker.workerStatus == environment.constants.workerStates.available))
    this.statusCards[this.const.workersAvailable].subtitle = workersAvailable.length.toString();
    this.statusCards[this.const.workersAvailable].type = workersAvailable.length > 0 ? 'success' : 'warning';

  }

  fillCanceledByWorker(servicesRequest: ServiceRequestDocument[]) {
    this.statusCards[this.const.canceledWorker].subtitle = servicesRequest.length.toString();
    this.statusCards[this.const.canceledWorker].type = servicesRequest.length > 0 ? 'warning' : 'primary';
  }

  fillCanceledByUser(servicesRequest: ServiceRequestDocument[]) {
    this.statusCards[this.const.canceledUser].subtitle = servicesRequest.length.toString();
    this.statusCards[this.const.canceledUser].type = servicesRequest.length > 0 ? 'warning' : 'primary';
  }

  onAdd(ev) {
    console.log("ADD->", ev)

  }

  onDetails(ev: ServiceRequestDocument) {
    console.log("onDetails:", ev)
    this.router.navigate(['/pages/service-request/details/' + ev.id]);
  }

  rowSelect(ev: any) {
    console.log(ev)
  }

  userRowSelect(ev) {

  }

  customAction(ev) {
    console.log(ev)
  }

  onDeleteConfirm(event): void {
    console.log(event)
  }

}
