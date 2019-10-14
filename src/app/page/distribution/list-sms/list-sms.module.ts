import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListSmsComponent } from './list-sms.component';
import { ListServiceService } from './list-service.service';
import { SharedModule } from '../../../shared/shared.module';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { ListSmsRoutes } from './list-sms.routing';



@NgModule({
  declarations: [ListSmsComponent],
  imports: [
    CommonModule,
    SharedModule,
    ComponentsModule,
    DirectivesModule,
    ListSmsRoutes,
  ],
  providers: [ ListServiceService ]
})
export class ListSmsModule { }
