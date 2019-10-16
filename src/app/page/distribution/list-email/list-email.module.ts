import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListEmailComponent } from './list-email.component';
import { SharedModule } from '../../../shared/shared.module';
import { ComponentsModule } from '../../../components/components.module';
import { ListEmailService } from './list-email.service';
import { DirectivesModule } from '../../../directives/directives.module';
import { ListEmailRoutes } from './list-email.routing';

@NgModule( {
  imports: [
    CommonModule,
    SharedModule,
    ComponentsModule,
    DirectivesModule,
    ListEmailRoutes
  ],
  declarations: [ ListEmailComponent ],
  providers: [ ListEmailService ]
} )
export class ListEmailModule {
}
