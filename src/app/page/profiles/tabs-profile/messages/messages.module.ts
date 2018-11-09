import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './messages.component';
import { SharedModule } from '../../../../shared/shared.module';
import { PipesModule } from '../../../../pipes/pipes.module';
import { MessagesService } from './messages.service';

@NgModule( {
  imports: [
    CommonModule,
    SharedModule,
    PipesModule,
  ],
  declarations: [ MessagesComponent ],
  exports: [ MessagesComponent ],
  providers: [ MessagesService ],
} )
export class MessagesModule {
}
