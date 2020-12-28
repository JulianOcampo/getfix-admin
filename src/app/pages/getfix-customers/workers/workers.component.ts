import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { WorkerService } from '../../../services/worker.service';
import { map } from 'rxjs/operators';
import { Worker } from '../../../models/worker'
import { Router } from '@angular/router';
@Component({
  selector: 'ngx-workers',
  templateUrl: './workers.component.html',
  styleUrls: ['./workers.component.scss']
})
export class WorkersComponent implements OnInit {
  settings = {
    mode: 'external',
    title: 'Models',
    actions: {
      add: false,
      delete: false,
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
      fullName: {
        title: 'User Name',
        type: 'text',
        width: '30%',
      },
      email: {
        title: 'User Email',
        type: 'text',
        width: '30%',
      },
      phoneNumber: {
        title: 'User Phone Number',
        type: 'text',
        width: '30%',
      },
      active: {
        title: 'Active',
        type: 'html',
        width: '10%',
        valuePrepareFunction: (cell, row) => {
          // console.log("este es el active", row.active)
          let handler = row.active;
          if (handler)
            return `<div class="text-center" > <i  class="fas fa-check-circle btn-success"></i> </div>`
          return ` <div  class="text-center" > <i class="fas fa-times-circle btn-danger" ></i> </div>`
        },
        filter: {
          type: 'checkbox',
          config: {
            true: 'true',
            false: 'false',
            resetText: 'clear',
          },
        },
      },
    },
    pager: {
      perPage: 10
    }
  };
  source: LocalDataSource;

  constructor(
    public _workerService: WorkerService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
  }

  onAdd(ev) {
    console.log("ADD->", ev)
  }

  onDetails(ev: Worker) {
    console.log("work", ev)
    this.router.navigate(['/pages/get-fix-customers/worker/' + ev.id]);
  }
  
  rowSelect(ev: any) {
    this.source = ev.source
  }

  userRowSelect() {
  }

  customAction(ev) {
    console.log(ev)
  }

  onDeleteConfirm(event): void {
    console.log(event)
  }


}
