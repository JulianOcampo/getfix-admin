import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GetfixCourseComponent } from './getfix-course.component';
import { ConfigurationsComponent } from './configurations/configurations.component';
import { ManageComponent } from './manage/manage.component';



const routes: Routes = [{
  path: '',
  component: GetfixCourseComponent,
  children: [
    {
      path: 'manage',
      component: ManageComponent,
    },
    {
      path: 'configurations',
      component: ConfigurationsComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GetfixCourseRoutingModule { }

export const routedComponents = [
  GetfixCourseComponent,
  ManageComponent,
];