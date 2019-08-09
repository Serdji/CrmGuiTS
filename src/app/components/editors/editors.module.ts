import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxWigModule } from 'ngx-wig';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogEditorComponent } from './dialog-editor/dialog-editor.component';
import { ButtonEditorComponent } from './button-editor/button-editor.component';
import { SharedModule } from '../../shared/shared.module';
import { DirectivesModule } from '../../directives/directives.module';
import { EditorEmailComponent } from './editor-email/editor-email.component';
import { EditorEmailService } from './editor-email/editor-email.service';

@NgModule( {
  imports: [
    CommonModule,
    NgxWigModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DirectivesModule,
  ],
  declarations: [
    EditorEmailComponent,
    DialogEditorComponent,
    ButtonEditorComponent,
  ],
  exports: [
    EditorEmailComponent,
    DialogEditorComponent,
    ButtonEditorComponent,
  ],
  entryComponents: [ DialogEditorComponent ],
  providers: [ EditorEmailService ]
} )
export class EditorsModule {
}
