import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPromotionsService } from './add-promotions.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { AddPromotionsComponent } from './add-promotions.component';
import { ComponentsModule } from '../../../components/components.module';

@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ComponentsModule,
  ],
  declarations: [ AddPromotionsComponent ],
  providers: [ AddPromotionsService ]
} )
export class AddPromotionsModule {
}
