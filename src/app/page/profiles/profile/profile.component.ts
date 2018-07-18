import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { ProfileService } from './profile.service';
import { Iprofile } from '../../../interface/iprofile';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { timer } from 'rxjs/observable/timer';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material';


@Component( {
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: [ './profile.component.styl' ]
} )
export class ProfileComponent implements OnInit, OnDestroy {

  public profile: Iprofile;
  public progress: boolean;
  public edit: boolean = false;
  public updateProfileForm: FormGroup;

  private isActive: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.initProfile();
    this.initFormUser();
  }

  private initProfile() {
    this.progress = true;
    this.route.params
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( params => {
        this.profileService.getProfile( params.id ).subscribe( ( profile: Iprofile ) => {
          this.updateProfileForm.patchValue( profile );
          this.profile = profile;
          this.progress = false;
        } );
      } );
  }

  private initFormUser() {
    this.updateProfileForm = this.fb.group( {
      gender: '',
      prefix: '',
      lastName: '',
      firstName: '',
      middleName: '',
      dob: '',
    }, {
      updateOn: 'submit',
    } );
  }

  sendFormProfile(): void {
    if ( !this.updateProfileForm.invalid ) {
      const params = {};
      for ( const key in this.updateProfileForm.getRawValue() ) {
        if ( this.updateProfileForm.get( key ).value !== 'dob' ) params[ key ] = this.updateProfileForm.get( key ).value;
      }
      Object.assign( params, { customerId: this.profile.customerId } );
      Object.assign( params, { dob: moment( this.updateProfileForm.get( 'dob' ).value ).format( 'YYYY-MM-DD' ) } );
      this.profileService.putProfile( params ).subscribe( ( profile: Iprofile ) => {
        this.windowDialog( 'Пользователь успешно изменен', 'ok' );
        this.profile = profile;
      } );
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
