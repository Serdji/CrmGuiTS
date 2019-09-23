import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxWigModule } from 'ngx-wig';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorComponent } from './editor/editor.component';
import { EditorService } from './editor/editor.service';
import { DialogEditorComponent } from './dialog-editor/dialog-editor.component';
import { ButtonEditorComponent } from './button-editor/button-editor.component';
import { SharedModule } from '../../shared/shared.module';
import { DirectivesModule } from '../../directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';

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
    EditorComponent,
    DialogEditorComponent,
    ButtonEditorComponent,
  ],
  exports: [
    EditorComponent,
    DialogEditorComponent,
    ButtonEditorComponent,
  ],
  entryComponents: [ DialogEditorComponent ],
  providers: [ EditorService ]
} )
export class EditorsModule {
}
