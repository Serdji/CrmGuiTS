import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPromotionsCodesComponent } from './add-promotions-codes.component';
import { AddPromotionsCodesService } from './add-promotions-codes.service';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../../../pipes/pipes.module';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { AddPromotionsCodesRoutes } from './add-promotions-codes.routing';
import { ProfileSearchService } from '../../profiles/profile-search/profile-search.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskModule } from 'ngx-mask';

@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    PipesModule,
    ComponentsModule,
    DirectivesModule,
    AddPromotionsCodesRoutes,
    TranslateModule,
    NgxMaskModule,
  ],
  declarations: [ AddPromotionsCodesComponent ],
  providers: [
    AddPromotionsCodesService,
    ProfileSearchService
  ]
} )
export class AddPromotionsCodesModule {
}
