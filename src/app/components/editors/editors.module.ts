import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxWigModule } from 'ngx-wig';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogEditorComponent } from './dialog-editor/dialog-editor.component';
import { ButtonEditorComponent } from './button-editor/button-editor.component';
import { SharedModule } from '../../shared/shared.module';
import { DirectivesModule } from '../../directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';
import { EditorEmailComponent } from './editor-email/editor-email.component';
import { EditorEmailService } from './editor-email/editor-email.service';
import { EditorSmsComponent } from './editor-sms/editor-sms.component';
import { EditorSmsService } from './editor-sms/editor-sms.service';

@NgModule( {
  imports: [
    CommonModule,
    NgxWigModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DirectivesModule,
    TranslateModule,
  ],
  declarations: [
    EditorEmailComponent,
    DialogEditorComponent,
    ButtonEditorComponent,
    EditorSmsComponent,
  ],
  exports: [
    EditorEmailComponent,
    DialogEditorComponent,
    ButtonEditorComponent,
    EditorSmsComponent,
  ],
  entryComponents: [ DialogEditorComponent ],
  providers: [
    EditorEmailService,
    EditorSmsService
  ]
} )
export class EditorsModule {
}
