import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './messages.component';
import { SharedModule } from '../../../../shared/shared.module';
import { PipesModule } from '../../../../pipes/pipes.module';
import { MessagesService } from './messages.service';
import { RouterModule } from '@angular/router';

@NgModule( {
  imports: [
    CommonModule,
    SharedModule,
    PipesModule,
    RouterModule,
  ],
  declarations: [ MessagesComponent ],
  exports: [ MessagesComponent ],
  providers: [ MessagesService ],
} )
export class MessagesModule {
}
