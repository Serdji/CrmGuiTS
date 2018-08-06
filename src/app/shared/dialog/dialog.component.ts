import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { UserService } from '../../page/users/user/user.service';
import { ProfileSearchService } from '../../page/profiles/profile-search/profile-search.service';
import { ProfileService } from '../../page/profiles/tabs-profile/profile/profile.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContactService } from '../../page/profiles/tabs-profile/contact/contact.service';

@Component( {
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: [ './dialog.component.styl' ],
} )
export class DialogComponent implements OnInit {

  public formUpdateContact: FormGroup;

  constructor(
    private userService: UserService,
    private profileSearchService: ProfileSearchService,
    private profileService: ProfileService,
    private contactService: ContactService,
    private fb: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<any>,
    @Inject( MAT_DIALOG_DATA ) public data: any
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.formUpdateContact = this.fb.group( {
      contactText: '',
    } );
    if ( this.data.status === 'update' ) {
      this.formUpdateContact.get( 'contactText' ).patchValue( this.data.params[ 2 ] );
    }
  }

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
        this.contactService.deleteContacts( this.data.params ).subscribe();
        break;
      case 'contact':
        this.dialogRef.close();
        console.log( this.formUpdateContact.get( 'contactText' ).value );
        console.log( this.data.params[ 1 ] );
        console.log( this.data.params[ 0 ] );
        break;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

