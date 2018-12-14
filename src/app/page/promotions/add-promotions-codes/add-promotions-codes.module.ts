import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPromotionsCodesComponent } from './add-promotions-codes.component';
import { AddPromotionsCodesService } from './add-promotions-codes.service';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
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
  declarations: [ AddPromotionsCodesComponent ],
  providers: [ AddPromotionsCodesService ]
} )
export class AddPromotionsCodesModule {
}
