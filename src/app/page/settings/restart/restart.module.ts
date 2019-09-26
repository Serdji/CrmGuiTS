import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestartComponent } from './restart.component';
import { SharedModule } from '../../../shared/shared.module';
import { RestartRoutes } from './restart.routing';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RestartRoutes,
    TranslateModule
  ],
  declarations: [RestartComponent]
})
export class RestartModule { }
