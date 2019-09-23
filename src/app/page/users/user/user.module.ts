import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { UserComponent } from './user.component';
import { UserService } from './user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '../../../directives/directives.module';
import { UserRoutes } from './user.routing';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule( {
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    DirectivesModule,
    ComponentsModule,
    UserRoutes,
    TranslateModule
  ],
  declarations: [ UserComponent ],
  providers: [ UserService ]
} )
export class UserModule {
}
