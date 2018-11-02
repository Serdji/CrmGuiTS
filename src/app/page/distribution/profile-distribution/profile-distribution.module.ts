import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileDistributionComponent } from './profile-distribution.component';
import { SharedModule } from '../../../shared/shared.module';
import { ComponentsModule } from '../../../components/components.module';
import { ProfileDistributionService } from './profile-distribution.service';

@NgModule( {
  imports: [
    CommonModule,
    SharedModule,
    ComponentsModule,
  ],
  declarations: [ ProfileDistributionComponent ],
  providers: [ ProfileDistributionService ]
} )
export class ProfileDistributionModule {
}
