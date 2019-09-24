import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivilegesComponent } from './privileges.component';
import { SharedModule } from '../../../../shared/shared.module';
import { PrivilegesService } from './privileges.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule( {
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [ PrivilegesComponent ],
  exports: [ PrivilegesComponent ],
  providers: [ PrivilegesService ]
} )
export class PrivilegesModule {
}
