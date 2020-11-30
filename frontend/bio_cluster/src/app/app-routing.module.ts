import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentLayoutComponent } from '@layout/content-layout/content-layout.component';
import { DrawerComponent } from '@modules/cluster/radial-tree/drawer/drawer.component';


const routes: Routes = [
  {
    path: '',
    // Redirect to Layoutcomponent
    component: DrawerComponent,
    children: [
      {
        path: 'cluster',
        loadChildren: () => import('@modules/cluster/cluster.module').then(m => m.ClusterModule)
      },
      {
        path: 'info',
        loadChildren: () =>
          import('@modules/info/info.module').then(m => m.InfoModule)
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('@modules/contact/contact.module').then(m => m.ContactModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
