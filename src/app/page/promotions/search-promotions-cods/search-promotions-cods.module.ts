import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPromotionsCodsComponent } from './search-promotions-cods.component';
import { SearchPromotionsCodsService } from './search-promotions-cods.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';

@NgModule( {
  imports: [
    CommonModule,
    // ReactiveFormsModule,
    SharedModule,
    PipesModule,
    ComponentsModule,
    DirectivesModule,
  ],
  declarations: [ SearchPromotionsCodsComponent ],
  providers: [ SearchPromotionsCodsService ]
} )
export class SearchPromotionsCodsModule {
}
