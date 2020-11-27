import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { ContactRoutes } from './contact.routing';
import { ContactComponent } from './page/contact.component';


@NgModule({
  declarations: [ContactComponent],
  imports: [
    ContactRoutes,
    SharedModule
  ]
})
export class ContactModule { }
