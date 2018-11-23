import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { MaterialModule } from '../material';
import { RouterModule } from '@angular/router';
import { BreadcrumbsService } from './breadcrumbs.service';

@NgModule( {
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  declarations: [ BreadcrumbsComponent ],
  exports: [ BreadcrumbsComponent ],
  providers: [ BreadcrumbsService ]
} )
export class BreadcrumbsModule {
}
