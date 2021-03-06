import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPromotionsCodesComponent } from './search-promotions-codes.component';
import { SearchPromotionsCodesService } from './search-promotions-codes.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { SearchPromotionsCodesRoutes } from './search-promotions-codes.routing';
import { TranslateModule } from '@ngx-translate/core';

@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    PipesModule,
    ComponentsModule,
    DirectivesModule,
    SearchPromotionsCodesRoutes,
    TranslateModule
  ],
  declarations: [ SearchPromotionsCodesComponent ],
  providers: [ SearchPromotionsCodesService ]
} )
export class SearchPromotionsCodesModule {
}
