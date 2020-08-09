import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { NotFoundComponent } from '../pages/miscellaneous/not-found/not-found.component';
import { CoursesPagesComponent } from './courses-pages.component';
import { TestComponent } from './test/test.component';
import { TestSentComponent } from './test-sent/test-sent.component';

const routes: Routes = [{
  path: '',
  component: CoursesPagesComponent,
  children: [
    {
      path: ':categoryId/worker/:wokerId',
      component: TestComponent
    },
    {
      path: 'success',
      component: TestSentComponent
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
  TestSentComponent
];