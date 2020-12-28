import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { GetfixRequestsService } from '../../../services/getfix-requests.service';
import { map, first } from 'rxjs/operators';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable } from 'rxjs';
import { ServiceRequesDocument } from '../../../models/service-request-document';

@Component({
  selector: 'ngx-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  public user: any;
  public userHistory: Array<any> = [];
  public userTotalSpending: number = 0;
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
      workerFullName: {
        title: 'Worker',
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
  source: LocalDataSource = new LocalDataSource();
  constructor(
    private activatedRoute: ActivatedRoute,
    private _userService: UserService,
    private _getfixReqService: GetfixRequestsService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      params => {
        console.log(params)
        this._userService.getUser(params.id).get().pipe(
          first()
        ).subscribe(res => {
          this.user = { id: res.id, ...res.data() };
          console.log(this.user)
          this._getfixReqService.getUserHistory(this.user.id).get().pipe(
            first(),
            map(history => history.docs.map(h =>
            ({
              id: h.id,
              workerFullName: h.data().worker.fullName,
              totalPrice: h.data().serviceRepair.totalPrice,
              brandType: h.data().serviceRepair.brandType,
              categoryType: h.data().serviceRepair.categoryType,
              ...Object.assign(new ServiceRequesDocument, h.data())
            })))
          ).subscribe(
            history => {
              this.userHistory = history;

              this.userHistory.forEach(element => {
                this.userTotalSpending = +element.totalPrice + this.userTotalSpending;

              });
              console.log(this.userHistory)
              console.log(history)
              this.source.load(history);
              this.source.setPaging(1, 5);
            }
          )
        })
      }
    )
  }



  gethistory(userId: string) {

  }
  onAdd(ev) {
    console.log("ADD->", ev)

  }
  onDetails(ev: User) {
    console.log("work", ev)
    // this.router.navigate(['/pages/get-fix-customers/user/' + ev.id]);
  }
  userRowSelect(ev) {
    console.log(ev)
  }

  customAction(ev) {
    console.log(ev)
  }

  onDeleteConfirm(event): void {
    console.log(event)

  }

}
