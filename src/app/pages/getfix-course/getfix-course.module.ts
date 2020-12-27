import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GetfixCourseRoutingModule, routedComponents } from './getfix-course-routing.module';

import { FormsModule as ngFormsModule, ReactiveFormsModule as ngReactiveFormsModule } from '@angular/forms';
import {
  NbSelectModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbTreeGridModule,
  NbCheckboxModule,
  NbButtonModule,
  NbAccordionModule,
  NbTooltipModule,
  NbSpinnerModule,
} from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ManageFormComponent } from './manage-form/manage-form.component';

@NgModule({
  declarations: [
    ...routedComponents,
    ManageFormComponent,

  ],
  imports: [
    CommonModule,
    GetfixCourseRoutingModule,
    ngFormsModule,
    ngReactiveFormsModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    Ng2SmartTableModule,
    NbCheckboxModule,
    NbSelectModule,
    NbButtonModule,
    NbAccordionModule,
    NbTooltipModule,
    NbSpinnerModule,

  ]
})
export class GetfixCourseModule { }
