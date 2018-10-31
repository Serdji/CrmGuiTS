import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListDistributionComponent } from './list-distribution.component';
import { SharedModule } from '../../../shared/shared.module';
import { ComponentsModule } from '../../../components/components.module';
import { ListDistributionService } from './list-distribution.service';

@NgModule( {
  imports: [
    CommonModule,
    SharedModule,
    ComponentsModule,
  ],
  declarations: [ ListDistributionComponent ],
  providers: [ ListDistributionService ]
} )
export class ListDistributionModule {
}
