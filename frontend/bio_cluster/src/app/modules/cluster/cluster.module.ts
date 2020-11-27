import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClusterRoutingModule } from './cluster.routing';

import { ClusterComponent } from './page/cluster.component';
import { TreeMapComponent } from './tree-map/tree-map.component';
import { RadialTreeComponent } from './radial-tree/radial-tree.component';
import { SharedModule } from '@shared/shared.module';
import { DatatableComponent } from './datatable/datatable.component';


@NgModule({
  declarations: [
    ClusterComponent,
    RadialTreeComponent,
    TreeMapComponent,
    DatatableComponent
  ],
  imports: [
    SharedModule,
    ClusterRoutingModule
  ]
})
export class ClusterModule { }
