import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListDistributionComponent } from './list-distribution.component';
import { SharedModule } from '../../../shared/shared.module';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ComponentsModule,
  ],
  declarations: [ListDistributionComponent]
})
export class ListDistributionModule { }
