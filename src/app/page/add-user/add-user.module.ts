import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './add-user.component';
import { AddUserService } from './add-user.service';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [AddUserComponent],
  providers: [ AddUserService]
})
export class AddUserModule { }
