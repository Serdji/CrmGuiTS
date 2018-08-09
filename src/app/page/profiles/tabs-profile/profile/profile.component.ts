import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { ProfileService } from './profile.service';
import { Iprofile } from '../../../../interface/iprofile';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { timer } from 'rxjs/observable/timer';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material';
import { IprofileNames } from '../../../../interface/iprofile-names';


@Component( {
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: [ './profile.component.styl' ]
} )
export class ProfileComponent implements OnInit, OnDestroy {

  @Input() id: number;

  public profile: Iprofile;
  public progress: boolean;
  public edit: boolean = false;
  public formUpdateProfile: FormGroup;
  public formAdditionalProfile: FormGroup;
  public profileNames: IprofileNames[];
  public isLoader: boolean = true;

  private isActive: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.initProfile();
    this.initFormProfile();
    this.initFormAdditionalProfile();
    this.profileService.subjectDeleteProfileNames.subscribe( _ => this.refreshTableProfileNames());
    this.profileService.subjectAddProfileNames.subscribe( _ => this.refreshTableProfileNames());
    this.profileService.subjectPutProfileNames.subscribe( _ => this.refreshTableProfileNames());
  }

  private initProfile() {
    this.progress = true;
    this.profileService.getProfile( this.id )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value ) => {
        Object.assign( value, value.customerNames.filter( customerName => customerName.customerNameType === 1 )[ 0 ] );
        this.formUpdateProfile.patchValue( value );
        this.profile = value;
        this.progress = false;
        this.initProfileNames( value.customerId );
      } );
  }


  private initProfileNames( id: number ) {
    this.profileService.getAllProfileNames( id )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( value => {
        this.profileNames = value;
        this.isLoader = false;
      } );
  }

  private refreshTableProfileNames() {
    timer( 100 ).subscribe( _ => {
      this.isLoader = true;
      this.initProfileNames( this.profile.customerId );
    } );
  }

  private initFormProfile() {
    this.formUpdateProfile = this.fb.group( {
      gender: '',
      lastName: '',
      firstName: '',
      secondName: '',
      dob: '',
    }, {
      updateOn: 'submit',
    } );
  }

  private initFormAdditionalProfile() {
    this.formAdditionalProfile = this.fb.group( {
      firstName: '',
      lastName: '',
      secondName: '',
    }, {
      updateOn: 'submit',
    } );
  }

  sendFormProfile(): void {
    if ( !this.formUpdateProfile.invalid ) {
      const params = {};
      for ( const key in this.formUpdateProfile.getRawValue() ) {
        if ( this.formUpdateProfile.get( key ).value !== 'dob' ) params[ key ] = this.formUpdateProfile.get( key ).value;
      }
      Object.assign( params, { customerId: this.profile.customerId } );
      Object.assign( params, { dob: moment( this.formUpdateProfile.get( 'dob' ).value ).format( 'YYYY-MM-DD' ) } );
      this.profileService.putProfile( params )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( ( profile: Iprofile ) => {
          this.windowDialog( 'Пассажир успешно изменен', 'ok' );
          this.profile = profile;
        } );
    }

  }

  sendFormAdditionalProfile(): void {
    if ( !this.formAdditionalProfile.invalid ) {
      const params = {};
      Object.assign( params, { customerId: this.profile.customerId, CustomerNameType: 2 } );
      Object.assign( params, this.formAdditionalProfile.getRawValue() );
      this.profileService.addAdditionalProfile( params ).subscribe( _ => {
        this.resetForm();
        this.windowDialog( 'Дополнительное ФИО успешно добавленно', 'ok' );
      } );
    }

  }

  resetForm() {
    this.formAdditionalProfile.reset();
    for ( const formControlName in this.formAdditionalProfile.value ) {
      this.formAdditionalProfile.get( `${ formControlName }` ).setErrors( null );
    }
  }

  deleteProfile(): void {
    this.windowDialog( `Вы действительно хотите удалить пассажира "${ this.profile.firstName }" ?`, 'delete', 'profile', true );
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
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( _ => {
          this.dialog.closeAll();
          this.edit = false;
        } );
    }
  }

  toggleEdit(): void {
    this.edit = !this.edit;
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
