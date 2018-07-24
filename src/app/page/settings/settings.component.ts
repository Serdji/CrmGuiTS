import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component( {
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: [ './settings.component.styl' ]
} )
export class SettingsComponent implements OnInit {

  private subs = new Subscription();

  public MANY_ITEMS: string = 'MANY_ITEMS';
  public formTableAsyncProfile: FormGroup;
  public itemsTableAsyncProfile: string[] = JSON.parse( localStorage.getItem( 'tableAsyncProfile' ));

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
    for ( const checkbox of this.itemsTableAsyncProfile ) {
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
