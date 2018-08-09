import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { ProfileComponent } from './profile.component';
import { ProfileService } from './profile.service';
import { ComponentsModule } from '../../../../components/components.module';

@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ComponentsModule,
  ],
  declarations: [ ProfileComponent ],
  exports: [ ProfileComponent ],
  providers: [ ProfileService ]
} )
export class ProfileModule {
}
