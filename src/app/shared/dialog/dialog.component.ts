import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { UserService } from '../../page/users/user/user.service';
import { ProfileSearchService } from '../../page/profiles/profile-search/profile-search.service';
import { ProfileService } from '../../page/profiles/tabs-profile/profile/profile.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../page/profiles/tabs-profile/contact/contact.service';
import { DocumentService } from '../../page/profiles/tabs-profile/document/document.service';
import * as moment from 'moment';
import { AuthService } from '../../services/auth.service';
import { AddSegmentationService } from '../../page/segmentation/add-segmentation/add-segmentation.service';
import { ListSegmentationService } from '../../page/segmentation/list-segmentation/list-segmentation.service';
import { takeWhile } from 'rxjs/operators';

@Component( {
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: [ './dialog.component.styl' ],
} )
export class DialogComponent implements OnInit, OnDestroy {

  public formUpdateContact: FormGroup;
  public formUpdateProfileName: FormGroup;
  public formUpdateDocument: FormGroup;

  private isActive: boolean;

  constructor(
    private userService: UserService,
    private profileSearchService: ProfileSearchService,
    private profileService: ProfileService,
    private contactService: ContactService,
    private documentService: DocumentService,
    private addSegmentationService: AddSegmentationService,
    private listSegmentationService: ListSegmentationService,
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<any>,
    @Inject( MAT_DIALOG_DATA ) public data: any
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.initForm();
  }

  private initForm() {
    this.formUpdateContact = this.fb.group( {
      contactText: '',
    } );
    this.formUpdateProfileName = this.fb.group( {
      firstName: [ '', Validators.required ],
      lastName: '',
      secondName: '',
    } );
    this.formUpdateDocument = this.fb.group( {
      num: '',
      firstName: '',
      lastName: '',
      secondName: '',
      expDate: '',
    } );
    if ( this.data.status === 'updateContact' ) {
      this.formUpdateContact.get( 'contactText' ).patchValue( this.data.params.text );
    }
    if ( this.data.status === 'updateProfileName' ) {
      this.formUpdateProfileName.patchValue( this.data.params.fioObj );
    }
    if ( this.data.status === 'updateDocument' ) {
      this.formUpdateDocument.patchValue( this.data.params.fioObj );
    }
  }

  onYesClick(): void {
    switch ( this.data.card ) {
      case 'user':
        this.userService.deleteUser( this.data.params )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( _ => {
            this.dialogRef.close();
            this.router.navigate( [ '/crm/listusers/' ] );
          } );
        break;
      case 'profiles':
        this.profileSearchService.deleteProfiles( this.data.params )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( _ => {
            this.dialogRef.close();
          } );
        break;
      case 'profile':
        this.profileService.deleteProfile( this.data.params )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( _ => {
            this.dialogRef.close();
            this.router.navigate( [ '/crm/profilesearch' ] );
          } );
        break;
      case 'contacts':
        this.contactService.deleteContacts( this.data.params )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( _ => {
            this.dialogRef.close();
          } );
        break;
      case 'contact':
        const paramsContact = {
          'ContactId': this.data.params.contactId,
          'CustomerId': this.data.params.customerId,
          'ContactTypeId': this.data.params.typeId,
          'ContactText': this.formUpdateContact.get( 'contactText' ).value
        };
        this.contactService.putContact( paramsContact )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( _ => {
            this.dialogRef.close();
          } );
        break;
      case 'profileNames':
        this.profileService.deleteProfileNames( this.data.params )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( _ => {
            this.dialogRef.close();
          } );
        break;
      case 'profileName':
        const paramsProfileName = {
          'customerId': this.data.params.customerId,
          'customerNameId': this.data.params.customerNameId,
          'customerNameType': this.data.params.customerNameType,
          'firstName': this.formUpdateProfileName.get( 'firstName' ).value,
          'lastName': this.formUpdateProfileName.get( 'lastName' ).value,
          'secondName': this.formUpdateProfileName.get( 'secondName' ).value,
        };
        this.profileService.putProfileName( paramsProfileName )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( _ => {
            this.dialogRef.close();
          } );
        break;
      case 'documents':
        this.documentService.deleteDocuments( this.data.params )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( _ => {
            this.dialogRef.close();
          } );
        break;
      case 'document':
        const paramsDocument = {
          'documentId': this.data.params.documentId,
          'customerId': this.data.params.customerId,
          'documentTypeId': this.data.params.documentTypeId,
          'num': this.formUpdateDocument.get( 'num' ).value,
          'firstName': this.formUpdateDocument.get( 'firstName' ).value,
          'lastName': this.formUpdateDocument.get( 'lastName' ).value,
          'secondName': this.formUpdateDocument.get( 'secondName' ).value,
          'expDate': moment( this.formUpdateDocument.get( 'expDate' ).value ).format( 'YYYY-MM-DD' ),
        };
        this.documentService.putDocument( paramsDocument )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( _ => {
            this.dialogRef.close();
          } );
        break;
      case 'segmentation':
        this.addSegmentationService.deleteSegmentation( this.data.params )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( _ => {
            this.dialogRef.close();
            this.router.navigate( [ '/crm/listsegmentation' ] );
          } );
        break;
      case 'segmentations':
        this.listSegmentationService.deleteSegmentations( this.data.params )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( _ => {
            this.dialogRef.close();
          } );
        break;
      case 'restart':
        const token = JSON.parse( localStorage.getItem( 'paramsToken' ) );
        this.auth.revokeRefreshToken( token.refreshToken )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( _ => {
            localStorage.clear();
            this.dialogRef.close();
            this.router.navigate( [ '' ] );
          } );
        break;
    }
  }

  openSegmentation( id ): void {
    this.router.navigate( [ '/crm/addsegmentation' ], { queryParams: { id } } );
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}

