import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { ProfileComponent } from './profile.component';
import { ProfileService } from './profile.service';
import { ComponentsModule } from '../../../../components/components.module';
import { PipesModule } from '../../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ComponentsModule,
    PipesModule,
    TranslateModule,
  ],
  declarations: [ ProfileComponent ],
  exports: [ ProfileComponent ],
  providers: [ ProfileService ]
} )
export class ProfileModule {
}
