import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEventComponent } from './add-event.component';
import { AddEventRoutes } from './add-event.routing';



@NgModule({
  declarations: [AddEventComponent],
  imports: [
    CommonModule,
    AddEventRoutes,
  ]
})
export class AddEventModule { }
