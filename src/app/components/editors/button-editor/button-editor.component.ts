import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogEditorComponent } from '../dialog-editor/dialog-editor.component';

@Component( {
  selector: 'app-button-editor',
  templateUrl: './button-editor.component.html',
  styleUrls: [ './button-editor.component.styl' ]
} )
export class ButtonEditorComponent implements OnInit {

  constructor( public dialog: MatDialog ) { }

  ngOnInit(): void {
  }

  openDialog(): void {
    this.dialog.open( DialogEditorComponent, {
      data: {
        ids: [1, 2, 4]
      }
    } );
  }

}
