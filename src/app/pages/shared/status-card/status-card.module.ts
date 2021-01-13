import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusCardComponent } from './status-card.component';
import { NbActionsModule, NbButtonModule, NbCardModule, NbContextMenuModule, NbIconModule, NbLayoutModule, NbMenuModule, NbSelectModule, NbSidebarModule, NbUserModule } from '@nebular/theme';
import { ThemeModule } from '../../../@theme/theme.module';


const NB_MODULES = [
  NbCardModule,
  NbIconModule,
  ThemeModule,

];
@NgModule({
  declarations: [StatusCardComponent],
  exports: [
    CommonModule,
    StatusCardComponent],
  imports: [
    CommonModule,
    ...NB_MODULES,
  ]
})
export class StatusCardModule {
  static forRoot(): ModuleWithProviders<StatusCardModule> {
    return {
      ngModule: StatusCardModule,
    };
  }
}
