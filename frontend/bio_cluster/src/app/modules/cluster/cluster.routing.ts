import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DatatableComponent } from './datatable/datatable.component';
import { RadialTreeComponent } from './radial-tree/radial-tree.component';
import { TreeMapComponent } from './tree-map/tree-map.component';

const routes: Routes = [

  {
    path: '',
    // component: RadialTreeComponent,
    children: [
      // { path: '', redirectTo: 'radial-tree', pathMatch: 'full' },
      { path: 'datatable', component: DatatableComponent },
      { path: 'radial-tree', component: RadialTreeComponent },
      { path: '**', redirectTo: 'radial-tree' }
    ]
  }


  // {
  //   path: '',
  //   component: RadialTreeComponent,
  //   // redirectTo: '/radial-tree',
  //   pathMatch: 'full'
  // },
  // {
  //   path: '/radial-tree',
  //   component: RadialTreeComponent
  // },
  // {
  //   path: 'tree-map',
  //   component: TreeMapComponent
  // },
  // {
  //   path: '/datatable',
  //   component: DatatableComponent
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClusterRoutingModule { }
