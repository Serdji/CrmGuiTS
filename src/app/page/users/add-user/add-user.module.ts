import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './add-user.component';
import { AddUserService } from './add-user.service';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '../../../directives/directives.module';
import { AddUserRoutes } from './add-user.routing';
import { TranslateModule } from '@ngx-translate/core';

@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    DirectivesModule,
    AddUserRoutes,
    TranslateModule
  ],
  declarations: [ AddUserComponent ],
  providers: [ AddUserService ]
} )
export class AddUserModule {
}
