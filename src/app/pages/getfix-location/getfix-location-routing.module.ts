import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchMapComponent } from './search-map/search-map.component';
import { GetfixLocationComponent } from './getfix-location.component';
import { SearchComponent } from './search-map/search/search.component';
import { MapComponent } from './search-map/map/map.component';


const routes: Routes = [{
  path: '',
  component: GetfixLocationComponent,
  children: [
    {
      path: 'workers',
      component: SearchMapComponent
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GetfixLocationRoutingModule { }
export const routedComponents = [
  GetfixLocationComponent,
  SearchMapComponent,
  MapComponent,
  SearchComponent,
];