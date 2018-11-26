import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPromotionsCodsComponent } from './add-promotions-cods.component';
import { AddPromotionsCodsService } from './add-promotions-cods.service';
import { SharedModule } from '../../../shared/shared.module';

@NgModule( {
  imports: [
    CommonModule,
    // ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [ AddPromotionsCodsComponent ],
  providers: [ AddPromotionsCodsService ]
} )
export class AddPromotionsCodsModule {
}
