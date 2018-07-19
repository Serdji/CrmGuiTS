import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProfileComponent } from './add-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { AddProfileService } from './add-profile.service';

@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [ AddProfileComponent ],
  providers: [ AddProfileService ]
} )
export class AddProfileModule {
}
