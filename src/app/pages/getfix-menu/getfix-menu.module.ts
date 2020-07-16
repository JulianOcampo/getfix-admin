import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop'

import { GetfixMenuRoutingModule, routedComponents } from './getfix-menu-routing.module';
import { FormsModule as ngFormsModule, ReactiveFormsModule as ngReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule, NbCheckboxModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CategoryFormComponent } from './category-form/category-form.component';
import { BrandFormComponent } from './brand-form/brand-form.component';


@NgModule({
  declarations: [...routedComponents, CategoryFormComponent, BrandFormComponent],
  imports: [
    CommonModule,
    GetfixMenuRoutingModule,
    DragDropModule,
    ngFormsModule,
    ngReactiveFormsModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    Ng2SmartTableModule,
    NbCheckboxModule,
  ]
})
export class GetfixMenuModule { }
