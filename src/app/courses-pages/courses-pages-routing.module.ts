import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { NotFoundComponent } from '../pages/miscellaneous/not-found/not-found.component';
import { CoursesPagesComponent } from './courses-pages.component';
import { TestComponent } from './test/test.component';

const routes: Routes = [{
  path: '',
  component: CoursesPagesComponent,
  children: [
    {
      path: ':categoryId/worker/:wokerId',
      component: TestComponent
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
export class CoursesPagesRoutingModule { }

export const routedComponents = [
  TestComponent,
];