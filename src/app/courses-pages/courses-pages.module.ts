import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CoursesPagesComponent } from './courses-pages.component';
import { CoursesPagesRoutingModule } from './courses-pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { NbMenuModule, NbCardModule, NbLayoutModule, NbSelectModule, NbIconModule, NbStepperModule, NbButtonModule, NbInputModule, NbRadioModule, NbSpinnerModule } from '@nebular/theme';

import { CommonModule } from '@angular/common';
import { routedComponents } from './courses-pages-routing.module';
import { FormsModule as ngFormsModule, ReactiveFormsModule as ngReactiveFormsModule } from '@angular/forms';



@NgModule({
  imports: [
    CommonModule,
    CoursesPagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbLayoutModule,
    NbSelectModule,
    NbIconModule,
    NbCardModule,
    NbStepperModule,
    NbButtonModule,
    ngFormsModule,
    ngReactiveFormsModule,
    NbInputModule,
    NbRadioModule,
    NbSpinnerModule,
  ],
  exports: [],
  declarations: [CoursesPagesComponent, ...routedComponents],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CoursesPagesModule { }
