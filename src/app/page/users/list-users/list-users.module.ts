import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListUsersComponent } from './list-users.component';
import { SharedModule } from '../../../shared/shared.module';
import { ListUsersService } from './list-users.service';
import { ComponentsModule } from '../../../components/components.module';
import { ListUsersRoutes } from './list-users.routing';
import { TranslateModule } from '@ngx-translate/core';

@NgModule( {
  imports: [
    CommonModule,
    SharedModule,
    ComponentsModule,
    ListUsersRoutes,
    TranslateModule
  ],
  declarations: [ ListUsersComponent ],
  providers: [ ListUsersService ]
} )
export class ListUsersModule {
}
