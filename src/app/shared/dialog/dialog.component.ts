import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
import { map, takeWhile } from 'rxjs/operators';
import { ProfileGroupService } from '../../page/special-groups/profile-group/profile-group.service';
import { IcustomerGroup } from '../../interface/icustomer-group';
import * as _ from 'lodash';
import { AddPromotionsService } from '../../page/promotions/add-promotions/add-promotions.service';
import { AddPromotionsCodesService } from '../../page/promotions/add-promotions-codes/add-promotions-codes.service';
import { ListEmailService } from '../../page/distribution/list-email/list-email.service';
import { DistributionService } from '../../page/distribution/distribution.service';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

const MY_FORMATS = {
  parse: {
    dateInput: 'DD MM YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMMM YYYY',
  },
};

@Component( {
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: [ './dialog.component.styl' ],  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [ MAT_DATE_LOCALE ] },
  ],
} )
export class DialogComponent implements OnInit, OnDestroy {

  public formUpdateContact: FormGroup;
  public formUpdateProfileName: FormGroup;
  public formUpdateDocument: FormGroup;
  public formProfileGroups: FormGroup;
  public formUpdatePromotions: FormGroup;
  public profileGroups: IcustomerGroup[];
  public isLoader: boolean;
  public paramsProfileGroup: any;



  constructor(
    private userService: UserService,
    private profileSearchService: ProfileSearchService,
    private profileService: ProfileService,
    private contactService: ContactService,
    private documentService: DocumentService,
    private addSegmentationService: AddSegmentationService,
    private listSegmentationService: ListSegmentationService,
    private profileGroupService: ProfileGroupService,
    private listEmailService: ListEmailService,
    private distributionService: DistributionService,
    private addPromotionsService: AddPromotionsService,
    private addPromotionsCodesService: AddPromotionsCodesService,
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<any>,
    @Inject( MAT_DIALOG_DATA ) public data: any
  ) { }

  ngOnInit(): void {

    this.isLoader = true;
    this.initForm();
    this.initGetAway();
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
    this.formProfileGroups = this.fb.group( {
      customerGroupId: '',
    } );
    this.formUpdatePromotions = this.fb.group( {
      promotionsName: '',
    } );
    switch ( this.data.status ) {
      case 'updateContact':
        this.formUpdateContact.get( 'contactText' ).patchValue( this.data.params.text );
        break;
      case 'updateProfileName':
        this.formUpdateProfileName.patchValue( this.data.params.fioObj );
        break;
      case 'updateDocument':
        this.formUpdateDocument.patchValue( this.data.params.fioObj );
        break;
      case 'updatePromotions':
        this.formUpdatePromotions.get( 'promotionsName' ).patchValue( this.data.params.promotionsName );
        break;
      case 'addProfileGroup':
        this.formProfileGroups.get( 'customerGroupId' ).valueChanges
          .pipe( untilDestroyed(this) )
          .subscribe( id => {
            if ( +id !== 0 ) {
              const params = {
                customerGroupId: +id,
                customerId: this.data.params.profileId
              };
              this.profileGroupService.addProfileGroupRelation( params )
                .pipe( untilDestroyed(this) )
                .subscribe( _ => {
                  this.initGetAway();
                } );
            }
          } );
        break;
    }
  }

  private initGetAway() {
    switch ( this.data.status ) {
      case 'addProfileGroup':
        this.isLoader = true;
        this.profileService.getProfile( this.data.params.profileId )
          .pipe(
            untilDestroyed(this),
            map( resp => resp.customerGroupRelations )
          )
          .subscribe( value => {
            this.paramsProfileGroup = value;
            this.isLoader = false;

            this.profileGroupService.getProfileGroup()
              .pipe(
                untilDestroyed(this),
                map( resp => _.differenceBy( resp, this.paramsProfileGroup, 'customerGroupId' ) )
              )
              .subscribe( ( profileGroups: any ) => {
                this.formProfileGroups.get( 'customerGroupId' ).patchValue( '' );
                this.formProfileGroups.get( 'customerGroupId' ).setErrors( null );
                this.profileGroups = profileGroups;
                this.profileGroupService.subjectProfileGroup.next();
              } );
          } );
        break;
    }
  }

  onYesClick(): void {
    switch ( this.data.card ) {
      case 'user':
        this.userService.deleteUser( this.data.params )
          .pipe( untilDestroyed(this) )
          .subscribe( _ => {
            this.dialogRef.close();
            this.router.navigate( [ '/crm/list-users/' ] );
          } );
        break;
      case 'profiles':
        this.profileSearchService.deleteProfiles( this.data.params )
          .pipe( untilDestroyed(this) )
          .subscribe( _ => {
            this.dialogRef.close();
          } );
        break;
      case 'profile':
        this.profileService.deleteProfile( this.data.params )
          .pipe( untilDestroyed(this) )
          .subscribe( _ => {
            this.dialogRef.close();
            this.router.navigate( [ '/crm/profile-search' ] );
          } );
        break;
      case 'contacts':
        this.contactService.deleteContacts( this.data.params )
          .pipe( untilDestroyed(this) )
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
          .pipe( untilDestroyed(this) )
          .subscribe( _ => {
            this.dialogRef.close();
          } );
        break;
      case 'profileNames':
        this.profileService.deleteProfileNames( this.data.params )
          .pipe( untilDestroyed(this) )
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
          .pipe( untilDestroyed(this) )
          .subscribe( _ => {
            this.dialogRef.close();
          } );
        break;
      case 'documents':
        this.documentService.deleteDocuments( this.data.params )
          .pipe( untilDestroyed(this) )
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
          .pipe( untilDestroyed(this) )
          .subscribe( _ => {
            this.dialogRef.close();
          } );
        break;
      case 'deleteSegmentation':
        this.addSegmentationService.deleteSegmentation( this.data.params )
          .pipe( untilDestroyed(this) )
          .subscribe( _ => {
            this.dialogRef.close();
            this.addSegmentationService.subjectDeleteSegmentation.next();
          } );
        break;
      case 'deleteSegmentations':
        this.listSegmentationService.deleteSegmentations( this.data.params )
          .pipe( untilDestroyed(this) )
          .subscribe( _ => {
            this.dialogRef.close();
          } );
        break;
      case 'restart':
        const token = JSON.parse( localStorage.getItem( 'paramsToken' ) );
        this.auth.revokeRefreshToken( token.refreshToken )
          .pipe( untilDestroyed(this) )
          .subscribe( _ => {
            localStorage.clear();
            this.dialogRef.close();
            this.router.navigate( [ '' ] );
            location.reload();
          } );
        break;
      case 'deleteProfileGroups':
        this.profileGroupService.deleteCustomerGroups( this.data.params )
          .pipe( untilDestroyed(this) )
          .subscribe( _ => {
            this.dialogRef.close();
          } );
        break;
      case 'startEmailDistribution':
        this.distributionService.startDistribution( this.data.params )
          .pipe( untilDestroyed(this) )
          .subscribe( _ => {
            this.distributionService.distributionSubject.next();
            this.dialogRef.close();
          } );
        break;
      case 'displayeds':
        this.distributionService.deleteDistributions( this.data.params )
          .pipe( untilDestroyed(this) )
          .subscribe( _ => {
            this.dialogRef.close();
          } );
        break;
      case 'deleteEmailDistribution':
        this.distributionService.deleteDistribution( this.data.params )
          .pipe( untilDestroyed(this) )
          .subscribe( _ => {
            this.dialogRef.close();
            this.router.navigate( [ '/crm/list-email' ] );
          } );
        break;
      case 'stopEmailDistribution':
        this.distributionService.stopDistribution( this.data.params )
          .pipe( untilDestroyed(this) )
          .subscribe( _ => {
            this.dialogRef.close();
            this.distributionService.distributionSubject.next();
          } );
        break;
      case 'startSmsDistribution':
        this.distributionService.startDistribution( this.data.params )
          .pipe( untilDestroyed(this) )
          .subscribe( _ => {
            this.distributionService.distributionSubject.next();
            this.dialogRef.close();
          } );
        break;
      case 'displayeds':
        this.distributionService.deleteDistributions( this.data.params )
          .pipe( untilDestroyed(this) )
          .subscribe( _ => {
            this.dialogRef.close();
          } );
        break;
      case 'deleteSmsDistribution':
        this.distributionService.deleteDistribution( this.data.params )
          .pipe( untilDestroyed(this) )
          .subscribe( _ => {
            this.dialogRef.close();
            this.router.navigate( [ '/crm/list-sms' ] );
          } );
        break;
      case 'stopSmsDistribution':
        this.distributionService.stopDistribution( this.data.params )
          .pipe( untilDestroyed(this) )
          .subscribe( _ => {
            this.dialogRef.close();
            this.distributionService.distributionSubject.next();
          } );
        break;
      case 'deletePromotions':
        this.addPromotionsService.deletePromotions( this.data.params )
          .pipe( untilDestroyed(this) )
          .subscribe( _ => {
            this.dialogRef.close();
            this.addPromotionsService.subjectDeletePromotions.next();
          } );
        break;
      case 'updatePromotions':
        const paramsPromotions = {
          'promotionId':  this.data.params.promotionsId,
          'promotionName': this.formUpdatePromotions.get( 'promotionsName' ).value
        };
        this.addPromotionsService.updatePromotions( paramsPromotions )
          .pipe( untilDestroyed(this) )
          .subscribe( _ => {
            this.dialogRef.close();
            this.addPromotionsService.subjectDeletePromotions.next();
          } );
        break;
      case 'promoCode':
        this.addPromotionsCodesService.deletePromoCode( this.data.params )
          .pipe( untilDestroyed(this) )
          .subscribe( _ => {
            this.dialogRef.close();
            this.addPromotionsCodesService.subjectDeletePromotionsCodes.next();
          } );
        break;
    }
  }

  deleteProfileGroup( id ): void {
    this.profileGroupService.deleteProfileGroupRelation( id )
      .pipe( untilDestroyed(this) )
      .subscribe( _ => {
        this.initGetAway();
        this.profileGroupService.subjectProfileGroup.next();
      } );
  }

  openSegmentation( id ): void {
    this.router.navigate( [ '/crm/add-segmentation' ], { queryParams: { id } } );
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {}

}

