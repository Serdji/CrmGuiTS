import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPromotionsCodesComponent } from './search-promotions-codes.component';
import { SearchPromotionsCodesService } from './search-promotions-codes.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';

@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    PipesModule,
    ComponentsModule,
    DirectivesModule,
  ],
  declarations: [ SearchPromotionsCodesComponent ],
  providers: [ SearchPromotionsCodesService ]
} )
export class SearchPromotionsCodesModule {
}
