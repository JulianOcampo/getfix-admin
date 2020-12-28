import { Component } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { NbAuthService, NbAuthToken } from '@nebular/auth';
import { timingSafeEqual } from 'crypto';
import { first, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AdminService } from '../services/admin.service';
import { PagesMenuService } from '../services/pages-menu.service';
import { WorkerService } from '../services/worker.service';
import { UserService } from '../services/user.service';
import { GetfixRequestsService } from '../services/getfix-requests.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
  <ngx-one-column-layout >
  <nb-menu [items]="menu" style="margin-top:-40px"></nb-menu>
  <router-outlet></router-outlet>
  </ngx-one-column-layout>
  `,
})
export class PagesComponent {
  userToken$: Observable<NbAuthToken>;
  isAuthenticated$: Observable<boolean>;
  menu = this._pagesMenuService.MENU_ITEMS;
  adminInfo: any = {
    adminRoleId: ''
  };
  statesForServiceRequest: Array<number> = [1, 2, 3, 4, 5,];
  statesForServiceRequestCanceledByClient: Array<number> = [6];
  statesForServiceRequestCanceledByWorker: Array<number> = [7];
  constructor(
    private authService: NbAuthService,
    private _adminService: AdminService,
    private _pagesMenuService: PagesMenuService,
    private _workerService: WorkerService,
    private _userService: UserService,
    public _serviceRequestService: GetfixRequestsService,


  ) {
    this.userToken$ = this.authService.onTokenChange();
    this.isAuthenticated$ = this.authService.isAuthenticated();
    this.isAuthenticated$.pipe(
      first()
    ).subscribe(
      res => {
        console.log(res)
        this.userToken$.pipe(
          first()
        ).subscribe(
          user => {
            console.log(user)
            console.log(user.getPayload().user_id)
            this._adminService.getAdminInfo(user.getPayload().user_id).valueChanges()
              .pipe()
              .subscribe(
                data => {
                  console.log(data)
                  localStorage.setItem('admin_info', JSON.stringify(data));
                  this.adminInfo = data;
                }
              )
          }
        )
      }
    )
    this._workerService.getWorkerList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        ))
    ).subscribe(data => {
      this._workerService.workers = data
    });
    this._userService.getUsersList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(users => {
      this._userService.users = users;
      console.log(users)
    })


    this._serviceRequestService.getServicesRequest().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
        ({
          id: c.payload.doc.id,
          ...c.payload.doc.data(),
          userFullName: c.payload.doc.data().user.fullName,
          workerFullName: c.payload.doc.data().worker.fullName,
          price: c.payload.doc.data().serviceRepair.totalPrice + ' $',
          date: formatDate(c.payload.doc.data().dateStart.toDate(), 'dd-MM-yyyy hh:mm', 'en-US')
        })
        )
      )).subscribe(servicesRequest => {
        this._serviceRequestService.serviceRequest = servicesRequest.filter(val => (this.statesForServiceRequest.includes(val.stateService)));
        this._serviceRequestService.serviceRequestCanceledByClient = servicesRequest.filter(val => (this.statesForServiceRequestCanceledByClient.includes(val.stateService)))
        this._serviceRequestService.serviceRequestCanceledByWorker = servicesRequest.filter(val => (this.statesForServiceRequestCanceledByWorker.includes(val.stateService)))


        this._pagesMenuService.MENU_ITEMS.find((val, index) => {
          if (val.children) {
            val.children.find((data, i) => {
              if ((data.title == 'Canceled by client' || data.title == 'Canceled by worker') && (this._serviceRequestService.serviceRequestCanceledByClient.length > 0 || this._serviceRequestService.serviceRequestCanceledByWorker.length > 0)) {
                this._pagesMenuService.MENU_ITEMS[index].badge = {
                  dotMode: true,
                  status: 'warning',
                }
              } else {
                this._pagesMenuService.MENU_ITEMS[index].badge = {}
              }
              if (data.title == 'Canceled by client' && this._serviceRequestService.serviceRequestCanceledByClient.length > 0) {
                this._pagesMenuService.MENU_ITEMS[index].children[i].badge =
                {
                  text: this._serviceRequestService.serviceRequestCanceledByClient.length.toString(),
                  status: 'danger',
                }
              } else if (data.title == 'Canceled by client' && this._serviceRequestService.serviceRequestCanceledByClient.length == 0) {
                this._pagesMenuService.MENU_ITEMS[index].children[i].badge = {}
              }
              if (data.title == 'Canceled by worker' && this._serviceRequestService.serviceRequestCanceledByWorker.length > 0) {
                this._pagesMenuService.MENU_ITEMS[index].children[i].badge =
                {
                  text: this._serviceRequestService.serviceRequestCanceledByWorker.length.toString(),
                  status: 'danger',
                }
              } else if (data.title == 'Canceled by worker' && this._serviceRequestService.serviceRequestCanceledByWorker.length == 0) {
                this._pagesMenuService.MENU_ITEMS[index].children[i].badge = {}
              }
            })
          }
        })
      })
  }




}
