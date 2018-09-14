import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { OrderService } from './order.service';
import { SharedModule } from '../../../../shared/shared.module';
import { PipesModule } from '../../../../pipes/pipes.module';

@NgModule( {
  imports: [
    CommonModule,
    SharedModule,
    PipesModule,
  ],
  declarations: [ OrderComponent ],
  exports: [ OrderComponent ],
  providers: [ OrderService ]
} )
export class OrderModule {
}
