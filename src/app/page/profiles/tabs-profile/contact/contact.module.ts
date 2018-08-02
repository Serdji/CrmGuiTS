import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from './contact.component';
import { ContactService } from './contact.service';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../../../../components/components.module';

@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ComponentsModule,
  ],
  declarations: [ ContactComponent ],
  exports: [ ContactComponent ],
  providers: [ ContactService ],
} )
export class ContactModule {
}
