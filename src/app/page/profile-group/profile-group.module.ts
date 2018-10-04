import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileGroupComponent } from './profile-group.component';
import { ProfileGroupService } from './profile-group.service';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../shared/material';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    ComponentsModule,
    DirectivesModule,
  ],
  declarations: [ProfileGroupComponent],
  providers: [ProfileGroupService]
})
export class ProfileGroupModule { }
