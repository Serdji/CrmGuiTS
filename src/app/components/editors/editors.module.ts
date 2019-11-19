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
import { OWL_DATE_TIME_FORMATS, OwlDateTimeModule } from 'ng-pick-datetime';
import { OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS, OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';

export const MY_FORMATS = {
  parseInput: 'DD.MM.YYYY | HH:mm',
  fullPickerInput: 'DD.MM.YYYY | HH:mm',
  datePickerInput: 'DD.MM.YYYY',
  timePickerInput: 'HH:mm',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

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
    OwlMomentDateTimeModule
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
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_FORMATS },
    { provide: OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
} )
export class EditorsModule {
}
