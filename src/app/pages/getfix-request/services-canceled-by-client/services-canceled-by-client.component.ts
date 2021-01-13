import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { ServiceRequestDocument } from '../../../models/service-request-document';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'ngx-services-canceled-by-client',
  templateUrl: './services-canceled-by-client.component.html',
  styleUrls: ['./services-canceled-by-client.component.scss']
})
export class ServicesCanceledByClientComponent implements OnInit {

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

  constructor(
    private _commonService: CommonService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.source.load(this._commonService.serviceRequestCanceledByClient);
    this._commonService.sendServiceRequestCanceledByClientObservable
      .subscribe(serviceRequest => {
        this.source.load(serviceRequest);
      })
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
