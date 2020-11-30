import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClusterRoutingModule } from './cluster.routing';

import { ClusterComponent } from './page/cluster.component';
import { TreeMapComponent } from './tree-map/tree-map.component';
import { SharedModule } from '@shared/shared.module';

import { RadialTreeComponent } from './radial-tree/radial-tree.component';
import { RadialTreePanelComponent } from './radial-tree/radial-tree-panel/radial-tree-panel.component';
import { DatatableComponent } from './datatable/datatable.component';
import { SidenavService } from './radial-tree/drawer/drawer.service';
import { DrawerComponent } from './radial-tree/drawer/drawer.component';


@NgModule({
  declarations: [
    ClusterComponent,
    RadialTreeComponent,
    RadialTreePanelComponent,
    TreeMapComponent,
    DatatableComponent,
    DrawerComponent
  ],
  imports: [
    SharedModule,
    ClusterRoutingModule
  ],
})
export class ClusterModule { }
