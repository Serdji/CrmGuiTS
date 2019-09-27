import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';

@Component( {
  selector: 'app-dialog-editor',
  templateUrl: './dialog-editor.component.html',
  styleUrls: [ './dialog-editor.component.styl' ]
} )
export class DialogEditorComponent implements OnInit, OnDestroy {

  private formChoice: FormGroup;
  private isActive: boolean;

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
    this.isActive = true;
    this.initForm();
    this.initSwitchEditor();
  }

  private initForm() {
    this.formChoice = this.fb.group( { choice: this.data.whatNewsletter !== 'choice' ? this.data.whatNewsletter : '' } );
  }

  private initSwitchEditor() {
    this.formChoice.get( 'choice' ).valueChanges
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( editor => this.data.whatNewsletter = editor );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
