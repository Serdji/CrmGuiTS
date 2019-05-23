import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { EntranceComponent } from './entrance.component';
import { RouterModule } from '@angular/router';
import { SidenavService } from '../../shared/layout/sidenav/sidenav.service';
import { EntranceRoutes } from './entrance.routing';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule( {
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    EntranceRoutes,
    PdfViewerModule
  ],
  declarations: [ EntranceComponent ],
  providers: [ SidenavService ]
} )
export class EntranceModule {
}
