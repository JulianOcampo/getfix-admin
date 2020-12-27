import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { Router, ActivatedRoute } from '@angular/router';
import { NbAuthService, NbAuthToken } from '@nebular/auth';
import { timingSafeEqual } from 'crypto';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AdminService } from '../services/admin.service';
import { PagesMenuService } from '../services/pages-menu.service';
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

  constructor(
    private authService: NbAuthService,
    private _adminService: AdminService,
    private _pagesMenuService: PagesMenuService,
  ) {
    MENU_ITEMS
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
  }




}
