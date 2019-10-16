import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListEventComponent } from './list-event.component';
import { ListEventRoutes } from './list-event.routing';
import { SharedModule } from '../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../../components/components.module';



@NgModule({
  declarations: [ListEventComponent],
  imports: [
    CommonModule,
    ListEventRoutes,
    SharedModule,
    TranslateModule,
    ComponentsModule,
  ]
})
export class ListEventModule { }
