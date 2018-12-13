import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPromotionsModule } from './add-promotions/add-promotions.module';
import { AddPromotionsCodesModule } from './add-promotions-codes/add-promotions-codes.module';
import { SearchPromotionsCodesModule } from './search-promotions-codes/search-promotions-codes.module';

@NgModule({
  imports: [
    CommonModule,
    AddPromotionsModule,
    AddPromotionsCodesModule,
    SearchPromotionsCodesModule,
  ],
  declarations: []
})
export class PromotionsModule { }
