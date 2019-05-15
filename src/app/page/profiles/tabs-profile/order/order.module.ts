import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { SharedModule } from '../../../../shared/shared.module';
import { PipesModule } from '../../../../pipes/pipes.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule( {
  imports: [
    CommonModule,
    SharedModule,
    PipesModule,
    ReactiveFormsModule,
  ],
  declarations: [ OrderComponent ],
  exports: [ OrderComponent ],
} )
export class OrderModule {
}
