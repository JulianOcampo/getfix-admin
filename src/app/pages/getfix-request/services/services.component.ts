import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ServiceRequesDocument } from '../../../models/service-request-document';
import { GetfixRequestsService } from '../../../services/getfix-requests.service';
import { PagesMenuService } from '../../../services/pages-menu.service';

@Component({
  selector: 'ngx-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

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
      stateService: {
        title: 'State',
        type: 'text',
        width: '15%',
        valuePrepareFunction: (cell, row) => {
          // console.log("este es el active", row.active)
          let handler = row.stateService;
          if (handler == 0)
            return `Denied by worker and searching new one`
          else if (handler == 1)
            return `Pending (in process of acceptance)`
          else if (handler == 2)
            return `Service Accepted`
          else if (handler == 3)
            return `Worker Arrived`
          else if (handler == 4)
            return `Worker Started Fixing`
          else if (handler == 5)
            return `Service Completed`
        },
        filter: {
          type: 'list',
          config: {
            selectText: 'All',
            list: [
              { value: '0', title: 'Denied by worker and searching new one' },
              { value: '1', title: 'Pending (in process of acceptance)' },
              { value: '2', title: 'Service Accepted' },
              { value: '3', title: 'Worker Arrived' },
              { value: '4', title: 'Worker Started Fixing' },
              { value: '5', title: 'Service Completed' },
            ],
          },
        },
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
  source: LocalDataSource;

  constructor(
    public _serviceRequestService: GetfixRequestsService,
  ) { }

  ngOnInit(): void {
  }


  onAdd(ev) {
    console.log("ADD->", ev)

  }
  onDetails(ev: ServiceRequesDocument) {
    console.log("onDetails:", ev)
    // this.router.navigate(['/pages/get-fix-customers/user/' + ev.id]);
  }

  rowSelect(ev: any) {
    this.source = ev.source;
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
