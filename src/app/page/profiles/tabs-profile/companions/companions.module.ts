import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanionsComponent } from './companions.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ComponentsModule } from '../../../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { CompanionsService } from './companions.service';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule( {
  imports: [
    CommonModule,
    SharedModule,
    ComponentsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  declarations: [ CompanionsComponent ],
  exports: [ CompanionsComponent ],
  providers: [ CompanionsService ]
} )
export class CompanionsModule {
}
