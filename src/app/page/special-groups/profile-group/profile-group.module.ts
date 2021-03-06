import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileGroupComponent } from './profile-group.component';
import { ProfileGroupService } from './profile-group.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../shared/material';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { ProfileGroupRoutes } from './profile-group.routing';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    ComponentsModule,
    DirectivesModule,
    ProfileGroupRoutes,
    TranslateModule
  ],
  declarations: [ProfileGroupComponent],
  providers: [ProfileGroupService]
})
export class ProfileGroupModule { }
