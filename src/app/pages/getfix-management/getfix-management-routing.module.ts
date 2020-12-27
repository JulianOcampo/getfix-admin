import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GetfixManagementComponent } from './getfix-management.component';
import { WorkersPendingComponent } from './workers-pending/workers-pending.component';


const routes: Routes = [{
  path: '',
  component: GetfixManagementComponent,
  children: [
    {
      path: 'workers-pending',
      component: WorkersPendingComponent
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GetfixManagementRoutingModule { }
export const routedComponents = [
  GetfixManagementComponent,
  WorkersPendingComponent,
];