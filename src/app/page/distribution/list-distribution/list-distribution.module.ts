import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListDistributionComponent } from './list-distribution.component';
import { SharedModule } from '../../../shared/shared.module';
import { ComponentsModule } from '../../../components/components.module';
import { ListDistributionService } from './list-distribution.service';
import { DirectivesModule } from '../../../directives/directives.module';

@NgModule( {
  imports: [
    CommonModule,
    SharedModule,
    ComponentsModule,
    DirectivesModule,
  ],
  declarations: [ ListDistributionComponent ],
  providers: [ ListDistributionService ]
} )
export class ListDistributionModule {
}
