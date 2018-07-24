import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SettingsService } from './settings.service';

@Component( {
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: [ './settings.component.styl' ]
} )
export class SettingsComponent implements OnInit {

  public formTableAsyncProfile: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initFormTableAsyncProfile();
    this.saveParamsTableAsyncProfile();
  }

  private initFormTableAsyncProfile() {
    this.formTableAsyncProfile = this.fb.group( {
      'firstName': '',
      'lastName': '',
      'middleName': '',
      'prefix': '',
      'gender': '',
      'dob': '',
    } );
    this.isParamsTableAsyncProfile();
  }

  private isParamsTableAsyncProfile() {
    for ( const checkbox of JSON.parse( localStorage.getItem( 'tableAsyncProfile' ) ) ) {
      this.formTableAsyncProfile.patchValue( { [ checkbox ]: true } );
    }
  }

  private saveParamsTableAsyncProfile() {
    this.formTableAsyncProfile.valueChanges.subscribe( checkbox => {
      const saveTableAsyncProfile = [];
      for ( const key in checkbox ) {
        if ( checkbox[ key ] ) {
          saveTableAsyncProfile.push( key );
        }
      }
      localStorage.setItem( 'tableAsyncProfile', JSON.stringify( saveTableAsyncProfile ) );
    } );
  }

}
