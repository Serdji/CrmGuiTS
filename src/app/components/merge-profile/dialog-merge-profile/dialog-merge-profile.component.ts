import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-merge-profile',
  templateUrl: './dialog-merge-profile.component.html',
  styleUrls: ['./dialog-merge-profile.component.styl']
})
export class DialogMergeProfileComponent implements OnInit, OnDestroy {

  private isActive: boolean;

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogMergeProfileComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: any
  ) { }

  ngOnInit(): void {
    this.isActive = true;
  }

  onYesClick(): void {
    console.log( this.data.params.customer );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
