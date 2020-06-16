import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnsubscribeComponent } from './unsubscribe.component';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { UnsubscribeService } from './unsubscribe.service';
import { UnsubscribeRoutes } from './unsubscribe.routing';
import { ComponentsModule } from '../../components/components.module';



@NgModule({
  declarations: [UnsubscribeComponent],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    ComponentsModule,
    UnsubscribeRoutes
  ],
  providers: [ UnsubscribeService ]
})
export class UnsubscribeModule { }
