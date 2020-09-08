import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';

import { GetfixCustomersRoutingModule, routedComponents } from './getfix-customers-routing.module';
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
} from '@nebular/theme';

@NgModule({
  declarations: [...routedComponents],
  imports: [
    CommonModule,
    GetfixCustomersRoutingModule,
    Ng2SmartTableModule,
    NbSelectModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbTreeGridModule,
    NbCheckboxModule,
    NbButtonModule,
    NbTabsetModule,
    ThemeModule
  ]
})
export class GetfixCustomersModule { }
