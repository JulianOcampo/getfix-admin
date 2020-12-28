import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GetfixRequestComponent } from './getfix-request.component';
import { ServicesCanceledByClientComponent } from './services-canceled-by-client/services-canceled-by-client.component';
import { ServicesComponent } from './services/services.component';


const routes: Routes = [{
  path: '',
  component: GetfixRequestComponent,
  children: [
    {
      path: 'all',
      component: ServicesComponent
    },
    {
      path: 'canceled-by-client',
      component: ServicesCanceledByClientComponent
    },
    {
      path: 'canceled-by-worker',
      component: ServicesCanceledByClientComponent
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
  ServicesCanceledByClientComponent,
  ServicesCanceledByClientComponent,
];