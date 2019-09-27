import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { PipesModule } from '../../../../pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { PromoCodeComponent } from './promo-code.component';
import { PromoCodeService } from './promo-code.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule( {
  imports: [
    CommonModule,
    SharedModule,
    PipesModule,
    RouterModule,
    TranslateModule,
  ],
  declarations: [ PromoCodeComponent ],
  exports: [ PromoCodeComponent ],
  providers: [ PromoCodeService ],
} )
export class PromoCodeModule {
}
