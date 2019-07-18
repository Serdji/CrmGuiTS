import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component( {
  selector: 'app-dialog-editor',
  templateUrl: './dialog-editor.component.html',
  styleUrls: [ './dialog-editor.component.styl' ]
} )
export class DialogEditorComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogEditorComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: any
  ) {}

  ngOnInit() {
  }

}
