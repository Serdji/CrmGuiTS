import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index.component';
import { SharedModule } from '../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { IndexService } from './index.service';
import { IndexRoutes } from './index.routing';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule( {
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    IndexRoutes,
    TranslateModule
  ],
  declarations: [ IndexComponent ],
  providers: [ IndexService ]
} )
export class IndexModule {
}
