import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

@Component( {
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: [ './dialog.component.styl' ],
} )
export class DialogComponent implements OnInit {

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<any>,
    @Inject( MAT_DIALOG_DATA ) public data: any
  ) { }

  ngOnInit(): void {}

  onYesClick(): void {
    this.dialogRef.close();
    console.log( this.data.loginId );
    this.router.navigate( [ '/crm/listusers/' ] );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
