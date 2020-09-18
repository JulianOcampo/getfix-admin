import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GetfixRequestComponent } from './getfix-request.component';
import { ServicesComponent } from './services/services.component';


const routes: Routes = [{
  path: '',
  component: GetfixRequestComponent,
  children: [
    {
      path: 'all',
      component: ServicesComponent
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GetfixRequestRoutingModule { }

export const routedComponents = [
  GetfixRequestComponent,
  ServicesComponent,
];