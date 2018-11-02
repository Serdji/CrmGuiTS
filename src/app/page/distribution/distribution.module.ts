import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListDistributionModule } from './list-distribution/list-distribution.module';
import { ProfileDistributionModule } from './profile-distribution/profile-distribution.module';

@NgModule({
  imports: [
    CommonModule,
    ListDistributionModule,
    ProfileDistributionModule,
  ],
  declarations: []
})
export class DistributionModule { }
