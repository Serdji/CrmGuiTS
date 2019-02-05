import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestartComponent } from './restart.component';
import { SharedModule } from '../../../shared/shared.module';
import { RestartRoutes } from './restart.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RestartRoutes
  ],
  declarations: [RestartComponent]
})
export class RestartModule { }
