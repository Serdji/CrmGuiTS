import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, timer } from 'rxjs';
import { DragulaService } from 'ng2-dragula';
import { takeWhile } from 'rxjs/operators';
import { SettingsService } from './settings.service';

@Component( {
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: [ './settings.component.styl' ]
} )
export class SettingsComponent implements OnInit, OnDestroy {

  private subs = new Subscription();

  public MANY_ITEMS: string = 'MANY_ITEMS';
  public formTableAsyncProfile: FormGroup;
  public itemsTableAsyncProfile: string[] = JSON.parse( localStorage.getItem( 'tableAsyncProfile' ) );
  public defaultCheckbox: string[];

  private isActive: boolean = true;

  constructor(
    private fb: FormBuilder,
    private dragulaService: DragulaService,
    private settingsService: SettingsService,
  ) {}

  ngOnInit(): void {
    this.initFormTableAsyncProfile();
    this.saveParamsTableAsyncProfile();
  }

  private initFormTableAsyncProfile() {
    this.defaultCheckbox = this.settingsService.getDefaultFieldTableAsyncProfiledTable( 'arr' );
    this.formTableAsyncProfile = this.fb.group( this.settingsService.getDefaultFieldTableAsyncProfiledTable( 'obj' ) );
    this.isParamsTableAsyncProfile();
  }

  private isParamsTableAsyncProfile() {
    for ( const checkbox of JSON.parse( localStorage.getItem( 'tableAsyncProfile' ) ) ) {
      this.formTableAsyncProfile.patchValue( { [ checkbox ]: true } );
    }
  }

  private saveParamsTableAsyncProfile() {
    this.formTableAsyncProfile.valueChanges
      .pipe(
        takeWhile( _ => this.isActive )
      )
      .subscribe( checkbox => {
        const saveTableAsyncProfile = [];
        this.itemsTableAsyncProfile = [];
        for ( const key in checkbox ) {
          if ( checkbox[ key ] ) {
            saveTableAsyncProfile.push( key );
            this.itemsTableAsyncProfile.push( key );
          }
        }
        localStorage.setItem( 'tableAsyncProfile', JSON.stringify( saveTableAsyncProfile ) );
      } );
    this.subs.add( this.dragulaService.dropModel( this.MANY_ITEMS )
      .pipe(
        takeWhile( _ => this.isActive )
      )
      .subscribe( ( { el, target, source, sourceModel } ) => {
        if ( this.itemsTableAsyncProfile.length !== sourceModel.length ) {
          timer( 1 ).subscribe( _ => this.itemsTableAsyncProfile = JSON.parse( localStorage.getItem( 'tableAsyncProfile' ) ) );
        } else {
          this.itemsTableAsyncProfile = sourceModel.filter( m => m !== null );
          localStorage.setItem( 'tableAsyncProfile', JSON.stringify( sourceModel ) );
        }
      } )
    );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}












