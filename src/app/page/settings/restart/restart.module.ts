import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestartComponent } from './restart.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [RestartComponent]
})
export class RestartModule { }
