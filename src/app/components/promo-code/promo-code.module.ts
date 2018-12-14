import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogPromoCodeComponent } from './dialog-promo-code/dialog-promo-code.component';
import { ButtonPromoCodeComponent } from './button-promo-code/button-promo-code.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { DirectivesModule } from '../../directives/directives.module';
import { DialogPromoCodeService } from './dialog-promo-code/dialog-promo-code.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    DirectivesModule,
  ],
  declarations: [
    DialogPromoCodeComponent,
    ButtonPromoCodeComponent,
  ],
  exports: [
    DialogPromoCodeComponent,
    ButtonPromoCodeComponent,
  ],
  entryComponents: [ DialogPromoCodeComponent ],
  providers: [ DialogPromoCodeService ],
})
export class PromoCodeModule { }
