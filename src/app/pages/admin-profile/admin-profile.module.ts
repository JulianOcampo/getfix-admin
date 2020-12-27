import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminProfileComponent } from './admin-profile.component';
import { InfoComponent } from './info/info.component';

import { FormsModule as ngFormsModule, ReactiveFormsModule as ngReactiveFormsModule } from '@angular/forms';
import {
  NbButtonModule,
  NbCardModule,
  NbDialogModule,
  NbIconModule,
  NbInputModule,
  NbSpinnerModule,
} from '@nebular/theme';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AdminProfileComponent, InfoComponent],
  imports: [
    CommonModule,
    NbButtonModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ngFormsModule,
    ngReactiveFormsModule,
    NbSpinnerModule,
    RouterModule,
    NbDialogModule.forChild(),
  ]
})
export class AdminProfileModule { }
