import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ButtonMergeProfileComponent } from './button-merge-profile/button-merge-profile.component';
import { DialogMergeProfileComponent } from './dialog-merge-profile/dialog-merge-profile.component';
import { FormsModule } from '@angular/forms';
import { DialogMergeProfileService } from './dialog-merge-profile/dialog-merge-profile.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    TranslateModule,
  ],
  declarations: [
    ButtonMergeProfileComponent,
    DialogMergeProfileComponent,
  ],
  exports: [
    ButtonMergeProfileComponent,
    DialogMergeProfileComponent,
  ],
  entryComponents: [ DialogMergeProfileComponent ],
  providers: [ DialogMergeProfileService ]
})
export class MergeProfileModule { }
