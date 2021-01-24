import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InViewportModule } from '@thisissoon/angular-inviewport';
import { GetfixRequestRoutingModule, routedComponents } from './getfix-request-routing.module';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule as ngFormsModule, ReactiveFormsModule as ngReactiveFormsModule } from '@angular/forms';
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
  NbDialogModule,
} from '@nebular/theme';
import { GoogleMapsModule } from '@angular/google-maps';
import { StatusCardModule } from '../shared/status-card/status-card.module';

@NgModule({
  declarations: [...routedComponents],
  imports: [
    CommonModule,
    ThemeModule,
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
    GoogleMapsModule,
    InViewportModule,
    NbDialogModule.forChild(),
    StatusCardModule,
    ngFormsModule,
    ngReactiveFormsModule,

  ]
})
export class GetfixRequestModule { }
