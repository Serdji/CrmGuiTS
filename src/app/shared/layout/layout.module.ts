import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LayoutComponent } from './layout.component';
import { LayoutService } from './layout.service';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { SidenavService } from './sidenav/sidenav.service';
import { BreadcrumbsModule } from '../breadcrumbs/breadcrumbs.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    BreadcrumbsModule
  ],
  declarations: [
    SidenavComponent,
    ToolbarComponent,
    LayoutComponent
  ],
  providers: [
    LayoutService,
    SidenavService,
  ]
})
export class LayoutModule { }
