import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { UserService } from '../../page/users/user/user.service';
import { ProfileSearchService } from '../../page/profiles/profile-search/profile-search.service';
import { ProfileService } from '../../page/profiles/tabs-profile/profile/profile.service';

@Component( {
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: [ './dialog.component.styl' ],
} )
export class DialogComponent implements OnInit {

  constructor(
    private userService: UserService,
    private profileSearchService: ProfileSearchService,
    private profileService: ProfileService,
    private router: Router,
    public dialogRef: MatDialogRef<any>,
    @Inject( MAT_DIALOG_DATA ) public data: any
  ) { }

  ngOnInit(): void {}

  onYesClick(): void {
    switch ( this.data.card ) {
      case 'user':
        this.dialogRef.close();
        this.userService.deleteUser( this.data.params ).subscribe();
        this.router.navigate( [ '/crm/listusers/' ] );
        break;
      case 'profiles':
        this.dialogRef.close();
        this.profileSearchService.deleteProfiles( this.data.params ).subscribe();
        break;
      case 'profile':
        this.dialogRef.close();
        this.profileService.deleteProfile( this.data.params ).subscribe();
        this.router.navigate( [ '/crm/profilesearch' ] );
        break;
      case 'contacts':
        this.dialogRef.close();
        // this.profileSearchService.deleteProfiles( this.data.params ).subscribe();
        break;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
