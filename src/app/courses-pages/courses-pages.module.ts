import { NgModule } from '@angular/core';
import { CoursesPagesComponent } from './courses-pages.component';
import { CoursesPagesRoutingModule } from './courses-pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { NbMenuModule, NbCardModule, NbLayoutModule, NbSelectModule, NbIconModule, NbStepperModule, NbButtonModule, NbInputModule, NbRadioModule } from '@nebular/theme';

import { TestComponent } from './test/test.component';
import { CommonModule } from '@angular/common';
import { routedComponents } from './courses-pages-routing.module';
import { FormsModule as ngFormsModule, ReactiveFormsModule as ngReactiveFormsModule } from '@angular/forms';
import { TestSentComponent } from './test-sent/test-sent.component';



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

  ],
  exports: [],
  declarations: [CoursesPagesComponent, ...routedComponents],
})
export class CoursesPagesModule { }