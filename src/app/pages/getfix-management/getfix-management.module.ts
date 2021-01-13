import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GetfixManagementRoutingModule, routedComponents } from './getfix-management-routing.module';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbIconModule,
  NbSelectModule,
  NbSpinnerModule, NbTreeGridModule
} from '@nebular/theme';


@NgModule({
  declarations: [...routedComponents],
  imports: [
    CommonModule,
    GetfixManagementRoutingModule,
    ThemeModule,
    Ng2SmartTableModule,
    NbSelectModule,
    NbCardModule,
    NbIconModule,
    NbIconModule,
    NbTreeGridModule,
    NbCheckboxModule,
    NbButtonModule,
    NbSpinnerModule,
  ]
})
export class GetfixManagementModule { }
