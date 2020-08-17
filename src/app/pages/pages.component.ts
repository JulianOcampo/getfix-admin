import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { Router, ActivatedRoute } from '@angular/router';
import { NbAuthService, NbAuthToken } from '@nebular/auth';
import { timingSafeEqual } from 'crypto';
import { ADMIN_ITEMS } from './admin-menu';
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

  menu = MENU_ITEMS;

  constructor(
  ) {

  }

  click(ev) {
    this.menu = ADMIN_ITEMS;
    console.log(ev)
  }

}
