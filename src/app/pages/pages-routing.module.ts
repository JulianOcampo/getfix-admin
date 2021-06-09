import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { GetfixMenuComponent } from './getfix-menu/getfix-menu.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { GetfixDashboardModule } from './getfix-dashboard/getfix-dashboard.module';
import { GetfixDashboardComponent } from './getfix-dashboard/getfix-dashboard.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: GetfixDashboardComponent,
    },
    {
      path: 'get-fix-menu',
      loadChildren: () => import('./getfix-menu/getfix-menu.module')
        .then(m => m.GetfixMenuModule),
    },
    {
      path: 'get-fix-courses',
      loadChildren: () => import('./getfix-course/getfix-course.module')
        .then(m => m.GetfixCourseModule),
    },
    {
      path: 'get-fix-customers',
      loadChildren: () => import('./getfix-customers/getfix-customers.module')
        .then(m => m.GetfixCustomersModule),
    },
    {
      path: 'service-request',
      loadChildren: () => import('./getfix-request/getfix-request.module')
        .then(m => m.GetfixRequestModule),
    }, {
      path: 'get-fix-location',
      loadChildren: () => import('./getfix-location/getfix-location.module')
        .then(m => m.GetfixLocationModule)
    }, {
      path: 'get-fix-management',
      loadChildren: () => import('./getfix-management/getfix-management.module')
        .then(m => m.GetfixManagementModule)
    },
    {
      path: 'dashboard-2',
      component: ECommerceComponent,
    },
    {
      path: 'admin-profile',
      component: AdminProfileComponent,
    },
    {
      path: 'iot-dashboard',
      component: DashboardComponent,
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: '',
      redirectTo: 'get-fix-menu/categories',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
