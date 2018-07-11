import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { UserService } from '../../page/users/user/user.service';

@Component( {
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: [ './dialog.component.styl' ],
} )
export class DialogComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router,
    public dialogRef: MatDialogRef<any>,
    @Inject( MAT_DIALOG_DATA ) public data: any
  ) { }

  ngOnInit(): void {}

  onYesClick(): void {
    this.dialogRef.close();
    this.userService.deleteUser( this.data.loginId ).subscribe();
    this.router.navigate( [ '/crm/listusers/' ] );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
