import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../page/users/user/user.service';
import { ProfileSearchService } from '../../page/profiles/profile-search/profile-search.service';
import { ProfileService } from '../../page/profiles/tabs-profile/profile/profile.service';
import { ContactService } from '../../page/profiles/tabs-profile/contact/contact.service';
import { DocumentService } from '../../page/profiles/tabs-profile/document/document.service';
import { AddSegmentationService } from '../../page/segmentation/add-segmentation/add-segmentation.service';
import { ListSegmentationService } from '../../page/segmentation/list-segmentation/list-segmentation.service';
import { ProfileGroupService } from '../../page/special-groups/profile-group/profile-group.service';
import { AddPromotionsService } from '../../page/promotions/add-promotions/add-promotions.service';
import { AddPromotionsCodesService } from '../../page/promotions/add-promotions-codes/add-promotions-codes.service';
import { TranslateModule } from '@ngx-translate/core';
import { ListEmailService } from '../../page/distribution/list-email/list-email.service';
import { ProfileEmailDistributionService } from '../../page/distribution/profile-email-distribution/profile-email-distribution.service';

@NgModule( {
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
  ],
  declarations: [ DialogComponent ],
  providers: [
    UserService,
    ProfileSearchService,
    ProfileService,
    ContactService,
    DocumentService,
    AddSegmentationService,
    ListSegmentationService,
    ProfileGroupService,
    ListEmailService,
    ProfileEmailDistributionService,
    AddPromotionsService,
    AddPromotionsCodesService,
  ]
})

export class DialogModule {
}
