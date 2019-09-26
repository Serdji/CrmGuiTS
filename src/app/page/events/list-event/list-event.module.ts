import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListEventComponent } from './list-event.component';
import { ListEventRoutes } from './list-event.routing';



@NgModule({
  declarations: [ListEventComponent],
  imports: [
    CommonModule,
    ListEventRoutes,
  ]
})
export class ListEventModule { }
