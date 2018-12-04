import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogPromoCodComponent } from './dialog-promo-cod/dialog-promo-cod.component';
import { ButtonPromoCodComponent } from './button-promo-cod/button-promo-cod.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    DirectivesModule,
  ],
  declarations: [
    DialogPromoCodComponent,
    ButtonPromoCodComponent,
  ],
  exports: [
    DialogPromoCodComponent,
    ButtonPromoCodComponent,
  ],
  entryComponents: [ DialogPromoCodComponent ]
})
export class PromoCodModule { }
