import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginService } from './login.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../shared/material/material.module';
import { LoginRoutes } from './login.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    LoginRoutes
  ],
  declarations: [ LoginComponent ],
  providers: [ LoginService ]
})
export class LoginModule { }
