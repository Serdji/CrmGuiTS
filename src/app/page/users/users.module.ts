import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserModule } from './add-user/add-user.module';
import { ListUsersModule } from './list-users/list-users.module'
import { UserModule } from './user/user.module';

@NgModule({
  imports: [
    CommonModule,
    AddUserModule,
    ListUsersModule,
    UserModule
  ],
  declarations: []
})
export class UsersModule { }
