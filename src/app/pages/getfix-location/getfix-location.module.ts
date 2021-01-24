import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GetfixLocationRoutingModule } from './getfix-location-routing.module';
import { routedComponents } from './getfix-location-routing.module';
import { ThemeModule } from '../../@theme/theme.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgxEchartsModule } from 'ngx-echarts';
import { NbCardModule, NbInputModule, NbSelectModule } from '@nebular/theme';


@NgModule({
  declarations: [...routedComponents],
  imports: [
    CommonModule,
    GetfixLocationRoutingModule,
    ThemeModule,
    GoogleMapsModule,
    LeafletModule.forRoot(),
    NgxEchartsModule,
    NbCardModule,
    NbSelectModule,
    NbInputModule,
  ]
})
export class GetfixLocationModule { }
