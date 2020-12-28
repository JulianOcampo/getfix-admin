import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { UserService } from '../../../services/user.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../../../models/user'

@Component({
  selector: 'ngx-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
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
  source: LocalDataSource = new LocalDataSource();

  constructor(
    public _userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getUserList();
  }


  getUserList() {
    this._userService.users
  }

  onAdd(ev) {
    console.log("ADD->", ev)

  }
  onDetails(ev: User) {
    console.log("work", ev)
    this.router.navigate(['/pages/get-fix-customers/user/' + ev.id]);
  }

  rowSelect(ev: any) {
    this.source = ev.source;
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
