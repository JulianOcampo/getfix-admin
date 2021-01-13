import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GetfixCustomersComponent } from './getfix-customers.component';
import { UsersComponent } from './users/users.component';
import { WorkersComponent } from './workers/workers.component';

import { UserDetailsComponent } from './user-details/user-details.component';
import { WorkerDetailsComponent } from '../shared/worker-details/worker-details.component';



const routes: Routes = [{
  path: '',
  component: GetfixCustomersComponent,
  children: [
    {
      path: 'users',
      component: UsersComponent,
    },
    {
      path: 'workers',
      component: WorkersComponent,
    },
    {
      path: 'worker/:id',
      component: WorkerDetailsComponent,
    },
    {
      path: 'user/:id',
      component: UserDetailsComponent,
    },
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GetfixCustomersRoutingModule { }

export const routedComponents = [
  GetfixCustomersComponent,
  UsersComponent,
  WorkersComponent,
  WorkerDetailsComponent,
  UserDetailsComponent,
];