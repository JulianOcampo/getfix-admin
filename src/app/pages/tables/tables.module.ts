import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule, NbCheckboxModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { TablesRoutingModule, routedComponents } from './tables-routing.module';
import { FsIconComponent } from './tree-grid/tree-grid.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { FormsModule as ngFormsModule, ReactiveFormsModule as ngReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ngFormsModule,
    ngReactiveFormsModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    TablesRoutingModule,
    Ng2SmartTableModule,
    NbCheckboxModule,
  ],
  declarations: [
    ...routedComponents,
    FsIconComponent,
    CategoriesComponent,
    CategoryFormComponent
  ],
})
export class TablesModule { }
