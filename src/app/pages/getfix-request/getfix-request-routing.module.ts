import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GetfixRequestComponent } from './getfix-request.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { ServicesCanceledByClientComponent } from './services-canceled-by-client/services-canceled-by-client.component';
import { ServicesCanceledByWorkerComponent } from './services-canceled-by-worker/services-canceled-by-worker.component';
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
      component: ServicesCanceledByWorkerComponent
    },
    {
      path: 'details/:id',
      component: ServiceDetailsComponent
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
  ServicesCanceledByWorkerComponent,
  ServiceDetailsComponent,

];