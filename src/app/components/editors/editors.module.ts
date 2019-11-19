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
import { OwlDateTimeIntl, OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { DefaultIntl } from './pick-date-time-option';

@NgModule( {
  imports: [
    CommonModule,
    NgxWigModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DirectivesModule,
    TranslateModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
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
    EditorSmsService,
    { provide: OwlDateTimeIntl, useClass: DefaultIntl },
  ]
} )
export class EditorsModule {
}
