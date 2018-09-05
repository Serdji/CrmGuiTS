import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AddProfileService } from './add-profile.service';
import { takeWhile } from 'rxjs/operators';
import { Iprofile } from '../../../interface/iprofile';
import { timer } from 'rxjs/observable/timer';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { ProfileService } from '../tabs-profile/profile/profile.service';

@Component( {
  selector: 'app-add-profile',
  templateUrl: './add-profile.component.html',
  styleUrls: [ './add-profile.component.styl' ]
} )
export class AddProfileComponent implements OnInit, OnDestroy {

  public formProfile: FormGroup;

  private isActive: boolean = true;


  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private addProfileService: AddProfileService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initFormProfile();
  }


  private initFormProfile() {
    this.formProfile = this.fb.group( {
      firstName: [ '', Validators.required ],
      lastName: '',
      secondName: '',
      gender: '',
      dob: [ '', Validators.required ],
    }, {
      updateOn: 'submit',
    } );
  }

  // private oneRequired() {
  //   const items = [ 'firstName', 'lastName', 'secondName' ];
  //   for ( const item of items ) {
  //     this.formProfile.get( item ).valueChanges
  //       .pipe( takeWhile( _ => this.isActive ) )
  //       .subscribe( value => {
  //         if ( value.length > 0 ) {
  //           for ( const item2 of items ) {
  //             this.formProfile.get( item2 ).clearValidators();
  //             this.formProfile.get( item2 ).setErrors( null );
  //           }
  //         } else {
  //           for ( const item2 of items ) {
  //             this.formProfile.get( item2 ).setErrors( { 'notEqual': true } );
  //           }
  //         }
  //     } );
  //   }
  // }

  sendForm(): void {
    if ( !this.formProfile.invalid ) {
      const params = {};
      for ( const key in this.formProfile.getRawValue() ) {
        if ( this.formProfile.get( key ).value !== 'dob' ) params[ key ] = this.formProfile.get( key ).value;
      }

      Object.assign( params, { dob: moment( this.formProfile.get( 'dob' ).value ).format( 'YYYY-MM-DD' ) } );

      this.addProfileService.addProfile( params )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( ( profile: Iprofile ) => {
          this.dialog.open( DialogComponent, {
            data: {
              message: 'Пассажир успешно добавлен',
              status: 'ok',
            },
          } );
          this.resetForm();
          timer( 1500 )
            .pipe( takeWhile( _ => this.isActive ) )
            .subscribe( _ => {
              this.router.navigate( [ `/crm/profile/${profile.customerId}` ] );
              this.dialog.closeAll();
            } );
        } );

    }
  }

  resetForm() {
    this.formProfile.reset();
    for ( const formControlName in this.formProfile.value ) {
      this.formProfile.get( `${ formControlName }` ).setErrors( null );
    }
  }

  clearForm(): void {
    this.resetForm();
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }
}
