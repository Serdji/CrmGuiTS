import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPromotionsCodsComponent } from './search-promotions-cods.component';
import { SearchPromotionsCodsService } from './search-promotions-cods.service';

@NgModule( {
  imports: [
    CommonModule
  ],
  declarations: [ SearchPromotionsCodsComponent ],
  providers: [ SearchPromotionsCodsService ]
} )
export class SearchPromotionsCodsModule {
}
