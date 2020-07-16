import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GetfixMenuComponent } from './getfix-menu.component';
import { CategoriesComponent } from './categories/categories.component';
import { BrandsComponent } from './brands/brands.component';


const routes: Routes = [{
  path: '',
  component: GetfixMenuComponent,
  children: [
    {
      path: 'categories',
      component: CategoriesComponent
    },
    {
      path:'brands',
      component: BrandsComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GetfixMenuRoutingModule { }

export const routedComponents = [
  GetfixMenuComponent,
  CategoriesComponent,
  BrandsComponent,

];