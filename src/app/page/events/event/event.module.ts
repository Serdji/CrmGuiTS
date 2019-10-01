import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from './event.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../../pipes/pipes.module';
import { EventRoutes } from './event.routing';



@NgModule({
  declarations: [EventComponent],
  imports: [
    CommonModule,
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ComponentsModule,
    EventRoutes,
    TranslateModule,
    PipesModule,
  ]
})
export class EventModule { }
