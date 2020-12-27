import { Component, OnInit } from '@angular/core';
import { PagesMenuService } from '../../../services/pages-menu.service';

@Component({
  selector: 'ngx-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  constructor(
    private _pagesMenuService: PagesMenuService,
  ) { }

  ngOnInit(): void {
  }
  change() {
    // this._pagesMenuService.MENU_ITEMS[0].ba = "cambio"
  }

}
