import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { GetfixRequestsService } from '../../../services/getfix-requests.service';
import { map, first } from 'rxjs/operators';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngx-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  public user: any;
  public userHistory: Array<any> = [];
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
        title: 'Worker Name',
        type: 'text',
        width: '40%',
      },
      brandName: {
        title: 'Brand Name',
        type: 'text',
        width: '40%',
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
    private _getfixReqServicie: GetfixRequestsService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      params => {
        console.log(params)
        this._userService.getUser2(params.id).get().pipe(
          first()
        ).subscribe(res => {
          this.user = { id: res.id, ...res.data() };
          console.log(this.user)
          this._getfixReqServicie.getUserHistory(this.user.id).get().pipe(
            first(),
          ).subscribe(
            res => {
              res.forEach(data => {
                console.log(data.data())
                this.userHistory.push({
                  id: data.id, workerFullName: data.data().workerDetails.fullName,
                  brandName: data.data().serviceRepair.brandType, totalPrice: data.data().serviceRepair.totalPrice, ...data.data()
                })
              })
              console.log(this.userHistory)
              this.source.load(this.userHistory);
              this.source.setPaging(1, 15);
            }
          )
          // this._getfixReqServicie.getUserHistory(this.user.id).get()
          //   .subscribe(
          //     res => {
          //       let i = 0;
          //       res.forEach(x => {
          //         console.log(x.data())
          //         console.log("lllllllllllllllll", x.data().refBrandId.id)
          //         this._getfixReqServicie.getBrandId(x.data().refBrandId).get().pipe(
          //           first()
          //         ).subscribe(y => {
          //           this.userHistory.push({ fullName: this.user.fullName, brandName: y.data().name })

          //           console.log("yyyyyyyyyyy", y.data())
          //           console.log(this.userHistory)
          //           this.source.load(this.userHistory);
          //           this.source.setPaging(1, 15);
          //         })
          //         i++;
          //       })
          //       console.log("...............", this.userHistory)



          //     }
          //   )

        })



      }
    )
  }

  getUser1() {
    console.log("********")
    const a = this._userService.getUser1("36KbewoX0jh4M7nxicpwOmqWu552").pipe(
      map((a) => {
        return a;
        // return chats.first(chat => chat.id === selectedRoomId)
      })
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
