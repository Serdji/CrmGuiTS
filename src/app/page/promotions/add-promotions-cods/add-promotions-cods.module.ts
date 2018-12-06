import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPromotionsCodsComponent } from './add-promotions-cods.component';
import { AddPromotionsCodsService } from './add-promotions-cods.service';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../../../pipes/pipes.module';
import { ComponentsModule } from '../../../components/components.module';

@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    PipesModule,
    ComponentsModule
  ],
  declarations: [ AddPromotionsCodsComponent ],
  providers: [ AddPromotionsCodsService ]
} )
export class AddPromotionsCodsModule {
}
