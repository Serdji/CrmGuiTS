import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesModule } from '../../services/services.module';
import { NgxWigModule } from 'ngx-wig';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorComponent } from './editor/editor.component';
import { EditorService } from './editor/editor.service';

@NgModule({
  imports: [
    CommonModule,
    ServicesModule,
    NgxWigModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ EditorComponent ],
  exports: [ EditorComponent ],
  providers: [ EditorService ]
})
export class EditorsModule { }
