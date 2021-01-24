import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxEchartsModule } from 'ngx-echarts';
import { NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { StatusCardModule } from '../shared/status-card/status-card.module';
import { GetfixEchartsPieComponent } from './echarts/echarts-pie.component';
import { GetfixEchartsBarComponent } from './echarts/echarts-bar.component';
import { GetfixDashboardComponent } from './getfix-dashboard.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    GetfixDashboardComponent,
    GetfixEchartsBarComponent,
    GetfixEchartsPieComponent,
  ],
  imports: [
    CommonModule,
    NgxEchartsModule,
    NbCardModule,
    Ng2SmartTableModule,
    NbIconModule,
    NbButtonModule,
    StatusCardModule,
    RouterModule,

  ]
})
export class GetfixDashboardModule { }
