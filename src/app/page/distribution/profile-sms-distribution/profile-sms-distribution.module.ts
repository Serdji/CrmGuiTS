import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSmsDistributionComponent } from './profile-sms-distribution.component';
import { SharedModule } from '../../../shared/shared.module';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileSmsDistributionRoutes } from './profile-sms-distribution.routing';
import { DistributionService } from '../distribution.service';



@NgModule({
  declarations: [ProfileSmsDistributionComponent],
  imports: [
    CommonModule,
    CommonModule,
    SharedModule,
    ComponentsModule,
    PipesModule,
    DirectivesModule,
    ProfileSmsDistributionRoutes,
    TranslateModule
  ],
  providers: [ DistributionService ]
})
export class ProfileSmsDistributionModule { }
