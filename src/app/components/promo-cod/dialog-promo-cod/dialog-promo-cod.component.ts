import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component( {
  selector: 'app-dialog-promo-cod',
  templateUrl: './dialog-promo-cod.component.html',
  styleUrls: [ './dialog-promo-cod.component.styl' ]
} )
export class DialogPromoCodComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogPromoCodComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: any
  ) { }

  ngOnInit(): void {
    console.log( this.data.params );
  }

}
