import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPromotionsModule } from './add-promotions/add-promotions.module';
import { AddPromotionsCodsModule } from './add-promotions-cods/add-promotions-cods.module';
import { SearchPromotionsCodsModule } from './search-promotions-cods/search-promotions-cods.module';

@NgModule({
  imports: [
    CommonModule,
    AddPromotionsModule,
    AddPromotionsCodsModule,
    SearchPromotionsCodsModule,
  ],
  declarations: []
})
export class PromotionsModule { }
