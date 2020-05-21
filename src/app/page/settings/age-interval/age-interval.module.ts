import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgeIntervalComponent } from './age-interval.component';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AgeIntervalRoutes } from './age-interval.routing';
import { AgeIntervalService } from './age-interval.service';


@NgModule( {
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AgeIntervalRoutes,
    TranslateModule
  ],
  declarations: [ AgeIntervalComponent ],
  providers: [ AgeIntervalService ]
} )
export class AgeIntervalModule {
}
