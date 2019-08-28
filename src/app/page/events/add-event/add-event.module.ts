import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEventComponent } from './add-event.component';
import { AddEventRoutes } from './add-event.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { ComponentsModule } from '../../../components/components.module';



@NgModule({
  declarations: [AddEventComponent],
  imports: [
    CommonModule,
    // ReactiveFormsModule,
    SharedModule,
    ComponentsModule,
    AddEventRoutes,
  ]
})
export class AddEventModule { }
