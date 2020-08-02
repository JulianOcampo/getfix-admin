import { NgModule } from '@angular/core';
import { CoursesPagesComponent } from './courses-pages.component';
import { CoursesPagesRoutingModule } from './courses-pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { NbMenuModule, NbCardModule, NbLayoutModule, NbSelectModule, NbIconModule } from '@nebular/theme';

import { TestComponent } from './test/test.component';
import { CommonModule } from '@angular/common';
import { routedComponents } from './courses-pages-routing.module';



@NgModule({
  imports: [
    CommonModule,
    CoursesPagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbLayoutModule,
    NbSelectModule,
    NbIconModule,
  ],
  exports:[],
  declarations: [CoursesPagesComponent, ...routedComponents],
})
export class CoursesPagesModule { }
