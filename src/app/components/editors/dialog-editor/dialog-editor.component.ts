import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component( {
  selector: 'app-dialog-editor',
  templateUrl: './dialog-editor.component.html',
  styleUrls: [ './dialog-editor.component.styl' ]
} )
export class DialogEditorComponent implements OnInit, OnDestroy {

  private formChoice: FormGroup;


  constructor(
    public dialogRef: MatDialogRef<DialogEditorComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: {
      params: { [ key: string ]: string[]; };
      totalCount: number;
      whatNewsletter: string;
    },
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {

    this.initForm();
    this.initSwitchEditor();
  }

  private initForm() {
    this.formChoice = this.fb.group( { choice: this.data.whatNewsletter !== 'choice' ? this.data.whatNewsletter : '' } );
  }

  private initSwitchEditor() {
    this.formChoice.get( 'choice' ).valueChanges
      .pipe( untilDestroyed(this) )
      .subscribe( editor => this.data.whatNewsletter = editor );
  }

  ngOnDestroy(): void {}

}
