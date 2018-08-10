import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentComponent } from './document.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { ComponentsModule } from '../../../../components/components.module';
import { DocumentService } from './document.service';

@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ComponentsModule,
  ],
  declarations: [ DocumentComponent ],
  exports: [ DocumentComponent ],
  providers: [ DocumentService ],
} )
export class DocumentModule {
}
