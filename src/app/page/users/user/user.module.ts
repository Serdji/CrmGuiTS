import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { UserComponent } from './user.component';
import { UserService } from './user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DirectiveModule } from '../../../directive/directive.module';

@NgModule( {
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    DirectiveModule,
  ],
  declarations: [ UserComponent ],
  providers: [ UserService ]
} )
export class UserModule {
}
