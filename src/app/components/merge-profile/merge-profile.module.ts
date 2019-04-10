import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ButtonMergeProfileComponent } from './button-merge-profile/button-merge-profile.component';
import { DialogMergeProfileComponent } from './dialog-merge-profile/dialog-merge-profile.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [
    ButtonMergeProfileComponent,
    DialogMergeProfileComponent,
  ],
  exports: [
    ButtonMergeProfileComponent,
    DialogMergeProfileComponent,
  ],
  entryComponents: [ DialogMergeProfileComponent ]
})
export class MergeProfileModule { }
