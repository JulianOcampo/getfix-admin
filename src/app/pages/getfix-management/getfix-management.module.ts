import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GetfixManagementRoutingModule, routedComponents } from './getfix-management-routing.module';
import { WorkersPendingComponent } from './workers-pending/workers-pending.component';


@NgModule({
  declarations: [...routedComponents],
  imports: [
    CommonModule,
    GetfixManagementRoutingModule
  ]
})
export class GetfixManagementModule { }
