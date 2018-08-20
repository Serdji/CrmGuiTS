import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { OrderService } from './order.service';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule( {
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [ OrderComponent ],
  exports: [ OrderComponent ],
  providers: [ OrderService ]
} )
export class OrderModule {
}
