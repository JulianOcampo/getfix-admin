import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GetfixRequestRoutingModule, routedComponents } from './getfix-request-routing.module';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {
  NbSelectModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbTreeGridModule,
  NbCheckboxModule,
  NbButtonModule,
  NbTabsetModule,
  NbSpinnerModule,
} from '@nebular/theme';
import { ServicesCanceledByClientComponent } from './services-canceled-by-client/services-canceled-by-client.component';
import { ServicesCanceledByWorkerComponent } from './services-canceled-by-worker/services-canceled-by-worker.component';

@NgModule({
  declarations: [...routedComponents,],
  imports: [
    CommonModule,
    GetfixRequestRoutingModule,
    Ng2SmartTableModule,
    NbSelectModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbTreeGridModule,
    NbCheckboxModule,
    NbButtonModule,
    NbTabsetModule,
    NbSpinnerModule,
    ThemeModule
  ]
})
export class GetfixRequestModule { }
