import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListUsersComponent } from './list-users.component';
import { SharedModule } from '../../shared/shared.module';
import { ListUsersService } from './list-users.service';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ ListUsersComponent],
  providers: [ ListUsersService]
})
export class ListUsersModule { }
