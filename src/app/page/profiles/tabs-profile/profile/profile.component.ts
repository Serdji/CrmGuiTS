import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeWhile, tap, toArray } from 'rxjs/operators';
import { ProfileService } from './profile.service';
import { Iprofile } from '../../../../interface/iprofile';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { timer } from 'rxjs/observable/timer';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { IprofileNames } from '../../../../interface/iprofile-names';


import { untilDestroyed } from 'ngx-take-until-destroy';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

@Component
( {
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: [ './profile.component.styl' ]
} )
export class ProfileComponent implements OnInit, OnDestroy {

  @Input() id: number;

  public profile: Iprofile;
  public profile$: Observable<Iprofile[]>;
  public progress: boolean;
  public edit: boolean = false;
  public formUpdateProfile: FormGroup;
  public formAddProfile: FormGroup;
  public profileNames: IprofileNames[];
  public isLoader: boolean = true;
  public showHide: boolean;


  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.progress = true;
    this.initProfile();
    this.initFormProfile();
    this.initFormAddProfile();
    this.profileService.subjectDeleteProfileNames
      .pipe( untilDestroyed( this ) )
      .subscribe( _ => this.refreshTableProfileNames() );
    this.profileService.subjectPutProfileNames.subscribe( _ => this.refreshTableProfileNames() );
  }

  private initProfile() {
    this.profile$ = this.profileService.subjectGetProfile
      .pipe(
        tap( ( profile: Iprofile ) => {
          this.formUpdateProfile.patchValue( profile );
          this.profile = profile;
          this.progress = false;
          this.initProfileNames( profile.customerId );
          console.log( profile );
        } ),
        toArray(),
        tap( console.log )
      );
  }


  private initProfileNames( id: number ) {
    this.profileService.getAllProfileNames( id )
      .pipe( untilDestroyed( this ) )
      .subscribe( value => {
        this.profileNames = value;
        this.isLoader = false;
      } );
  }

  private refreshTableProfileNames() {
    timer( 100 )
      .pipe( untilDestroyed( this ) )
      .subscribe( _ => {
        this.isLoader = true;
        this.initProfileNames( this.profile.customerId );
      } );
  }

  private initFormProfile() {
    this.formUpdateProfile = this.fb.group( {
      firstName: [ '', Validators.required ],
      lastName: '',
      secondName: '',
      gender: '',
      dob: '',
      comment: '',
    } );
  }

  private initFormAddProfile() {
    this.formAddProfile = this.fb.group( {
      firstName: [ '', Validators.required ],
      lastName: '',
      secondName: '',
    } );
  }

  sendFormUpdateProfile(): void {
    if ( !this.formUpdateProfile.invalid ) {
      const params = {};
      for ( const key in this.formUpdateProfile.getRawValue() ) {
        if ( this.formUpdateProfile.get( key ).value !== 'dob' ) params[ key ] = this.formUpdateProfile.get( key ).value;
      }
      Object.assign( params, { customerId: this.profile.customerId, customerNameId: this.profile.customerNameId } );
      Object.assign( params, { dob: moment( this.formUpdateProfile.get( 'dob' ).value ).format( 'YYYY-MM-DD' ) } );
      this.profileService.putProfile( params )
        .pipe( untilDestroyed( this ) )
        .subscribe( profile => {
          Object.assign( profile, profile.customerNames.filter( customerName => customerName.customerNameType === 1 )[ 0 ] );
          this.windowDialog( 'DIALOG.OK.PASSENGER_CHANGED', 'ok' );
          this.profile = profile;
        } );
    }

  }

  sendFormAddProfile(): void {
    if ( !this.formAddProfile.invalid ) {
      const params = {};
      Object.assign( params, { customerId: this.profile.customerId, CustomerNameType: 2 } );
      Object.assign( params, this.formAddProfile.getRawValue() );
      this.profileService.addAddProfile( params )
        .pipe( untilDestroyed( this ) )
        .subscribe( _ => {
          this.windowDialog( 'DIALOG.OK.ADDITIONAL_NAME', 'ok' );
          timer( 1500 )
            .pipe( untilDestroyed( this ) )
            .subscribe( _ => {
              this.refreshTableProfileNames();
              this.resetForm();
            } );
        } );
    }

  }

  resetForm() {
    this.formAddProfile.reset();
    for ( const formControlName in this.formAddProfile.value ) {
      this.formAddProfile.get( `${formControlName}` ).setErrors( null );
    }
  }

  deleteProfile(): void {
    this.windowDialog( `DIALOG.DELETE.CUSTOMER`, 'delete', 'profile', true );
  }

  private windowDialog( messDialog: string, params: string, card: string = '', disableTimer: boolean = false ) {
    this.dialog.open( DialogComponent, {
      data: {
        message: messDialog,
        status: params,
        params: this.profile.customerId,
        card,
      },
    } );
    if ( !disableTimer ) {
      timer( 1500 )
        .pipe( untilDestroyed( this ) )
        .subscribe( _ => {
          this.dialog.closeAll();
          this.edit = false;
        } );
    }
  }

  toggleEdit(): void {
    this.edit = !this.edit;
  }

  ngOnDestroy(): void {}

  showHiden(): void {
    this.showHide = !this.showHide;
  }

}
