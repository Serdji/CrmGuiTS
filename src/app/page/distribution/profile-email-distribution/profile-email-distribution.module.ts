import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileEmailDistributionRoutes } from './profile-email-distribution.routing';
import { ProfileEmailDistributionComponent } from './profile-email-distribution.component';
import { ProfileEmailDistributionService } from './profile-email-distribution.service';

@NgModule( {
  imports: [
    CommonModule,
    SharedModule,
    ComponentsModule,
    PipesModule,
    DirectivesModule,
    ProfileEmailDistributionRoutes,
    TranslateModule
  ],
  declarations: [ ProfileEmailDistributionComponent ],
  providers: [ ProfileEmailDistributionService ]
} )
export class ProfileEmailDistributionModule {
}
