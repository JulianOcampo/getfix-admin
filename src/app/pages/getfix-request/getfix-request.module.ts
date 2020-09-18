import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GetfixRequestRoutingModule, routedComponents } from './getfix-request-routing.module';
import { GetfixRequestComponent } from './getfix-request.component';


@NgModule({
  declarations: [...routedComponents],
  imports: [
    CommonModule,
    GetfixRequestRoutingModule
  ]
})
export class GetfixRequestModule { }
