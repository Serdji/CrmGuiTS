import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogPromoCodComponent } from './dialog-promo-cod/dialog-promo-cod.component';
import { ButtonPromoCodComponent } from './button-promo-cod/button-promo-cod.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DialogPromoCodComponent,
    ButtonPromoCodComponent,
  ],
  exports: [
    DialogPromoCodComponent,
    ButtonPromoCodComponent,
  ],
})
export class PromoCodModule { }
