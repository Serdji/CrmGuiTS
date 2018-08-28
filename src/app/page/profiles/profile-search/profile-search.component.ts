import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Icountry } from '../../../interface/icountry';
import { ProfileSearchService } from './profile-search.service';
import { takeWhile, map, delay } from 'rxjs/operators';
import { Observable, timer } from 'rxjs';
import { Itree } from '../../../interface/itree';
import { Igroups } from '../../../interface/igroups';
import { Iprofiles } from '../../../interface/Iprofiles';
import { TableAsyncProfileService } from '../../../components/tables/table-async-profile/table-async-profile.service';
import { IpagPage } from '../../../interface/ipag-page';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { IprofileSearch } from '../../../interface/iprofile-search';
import { Ilocation } from '../../../interface/ilocation';

@Component( {
  selector: 'app-profile-search',
  templateUrl: './profile-search.component.html',
  styleUrls: [ './profile-search.component.styl' ]
} )
export class ProfileSearchComponent implements OnInit, OnDestroy {

  public formProfileSearch: FormGroup;
  public countrys: Icountry[];
  public locations: Ilocation[];
  public locationFromOptions: Observable<Ilocation[]>;
  public locationToOptions: Observable<Ilocation[]>;
  public trees: Itree[];
  public groups: Igroups[];
  public profiles: Iprofiles;
  public isTableCard: boolean = false;
  public isLoader: boolean = false;

  private autDelay: number = 500;
  private autLength: number = 3;
  private isActive: boolean = true;
  private sendProfileParams: IprofileSearch;

  constructor(
    private fb: FormBuilder,
    private profileSearchService: ProfileSearchService,
    private tableAsyncProfileService: TableAsyncProfileService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initLocation();
    this.initForm();
    this.formDisable();
    this.initAutocomplete();
    this.initTableAsync();
    this.profileSearchService.subjectDeleteProfile.subscribe( _ => this.serverRequest( this.sendProfileParams ) );
  }


  sendForm(): void {
    this.creatingObjectForm();
  }

  clearForm(): void {
    this.resetForm();
    this.router.navigate( [ '/crm/profilesearch' ], { queryParams: {} } );
  }

  private resetForm() {
    for ( const formControlName in this.formProfileSearch.value ) {
      this.formProfileSearch.get( `${ formControlName }` ).patchValue( '' );
      this.formProfileSearch.get( `${ formControlName }` ).setErrors( null );
    }
  }

  private initTableAsync() {
    this.tableAsyncProfileService.subjectPage.subscribe( ( value: IpagPage ) => {
      const pageIndex = value.pageIndex * value.pageSize;
      const paramsAndCount = Object.assign( this.sendProfileParams, { sortvalue: 'last_name', from: pageIndex, count: value.pageSize } );
      this.profileSearchService.getProfileSearch( paramsAndCount )
        .pipe(
          takeWhile( _ => this.isActive )
        )
        .subscribe( ( profile: Iprofiles ) => this.tableAsyncProfileService.setTableDataSource( profile.result ) );
    } );
  }


  private initLocation() {
    this.profileSearchService.getLocation()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: Ilocation[] ) => {
        this.locations = value;
      } );
  }

  private initAutocomplete() {
    this.locationFromOptions = this.autocomplete( 'deppoint' );
    this.locationToOptions = this.autocomplete( 'arrpoint' );
  }

  private autocomplete( formControlName: string ): Observable<Ilocation[]> {
    return this.formProfileSearch.get( formControlName ).valueChanges
      .pipe(
        takeWhile( _ => this.isActive ),
        delay( this.autDelay ),
        map( val => {
          return this.locations.filter( location => location.locationCode.toLowerCase().includes( val.toLowerCase() ) );
        } )
      );
  }

  private initForm() {
    this.formProfileSearch = this.fb.group( {
      lastname: '',
      firstname: '',
      customerid: '',
      gender: '',
      divisionid: '',
      dobfrominclude: '',
      dobtoexclude: '',
      ticket: '',
      recloc: '',
      emd: '',
      flight: '',
      flightdatefrom: '',
      flightdateto: '',
      deppoint: '',
      arrpoint: '',
      deptimefrominclude: '',
      deptimetoexclude: '',
      cab: '',
      rdb: '',
      tariffcode: '',
      servicecode: '',
      amountfrom: '',
      amountto: '',
      amountdatefrom: '',
      amountdateto: '',
      contactemail: '',
      contacttext: '',
      contactsexist: '',
      id: '',
    }, {
      updateOn: 'submit',
    } );
    this.switchCheckbox();
    timer( 500 ).subscribe( _ => this.formFilling() );
  }

  private formDisable() {
    this.formProfileSearch.get( 'divisionid' ).disable();
    this.formProfileSearch.get( 'tariffcode' ).disable();
    this.formProfileSearch.get( 'id' ).disable();
    this.formProfileSearch.get( 'amountfrom' ).disable();
    this.formProfileSearch.get( 'amountto' ).disable();
    this.formProfileSearch.get( 'amountdatefrom' ).disable();
    this.formProfileSearch.get( 'amountdateto' ).disable();
  }

  private switchCheckbox() {
    this.formProfileSearch.get( 'contactsexist' ).valueChanges.subscribe( value => {
      this.formProfileSearch.get( 'contactemail' )[ value ? 'disable' : 'enable' ]();
      this.formProfileSearch.get( 'contacttext' )[ value ? 'disable' : 'enable' ]();
    } );
  }

  private formFilling() {
    this.route.queryParams.subscribe( value => {
      if ( Object.keys( value ).length !== 0 ) {

        const newObjectForm = {};
        for ( const key of Object.keys( value ) ) {
          if ( this.isKeys( key, 'all' ) ) newObjectForm[ key ] = value[ key ];
          if ( this.isKeys( key, 'data' ) ) newObjectForm[ key ] = value[ key ] ? new Date( value[ key ].split( '.' ).reverse().join( ',' ) ) : '';
          if ( this.isKeys( key, 'checkbox' ) ) newObjectForm[ key ] = value[ key ];
        }

        this.formProfileSearch.patchValue( newObjectForm );
        this.creatingObjectForm();
      }
    } );
  }

  private creatingObjectForm() {
    const params = {};
    const highlightObj = {};
    const formValue = Object.keys( this.formProfileSearch.value );

    for ( const key of formValue ) {
      if ( this.isKeys( key, 'all' ) ) highlightObj[ key ] = `${this.formProfileSearch.get( key ).value.trim()}`;
      if ( this.isKeys( key, 'data' ) ) highlightObj[ key ] = moment( this.formProfileSearch.get( key ).value ).format( 'DD.MM.YYYY' );
      if ( this.isKeys( key, 'checkbox' ) ) {
        if ( this.formProfileSearch.get( key ).value ) highlightObj[ key ] = !this.formProfileSearch.get( key ).value;
        else delete highlightObj[ key ];
      }
    }

    for ( const key of Object.keys( highlightObj ) ) {
      if ( highlightObj[ key ] !== '' && highlightObj[ key ] !== 'Invalid date' && highlightObj[ key ] !== undefined ) params[ key ] = highlightObj[ key ];
    }

    this.router.navigate( [ '/crm/profilesearch' ], { queryParams: params } );
    this.serverRequest( params );
  }

  private serverRequest( params: IprofileSearch ) {
    this.isTableCard = true;
    this.isLoader = true;
    this.sendProfileParams = params;
    Object.assign( params, { sortvalue: 'last_name', from: 0, count: 10 } );
    this.profileSearchService.getProfileSearch( params )
      .pipe(
        takeWhile( _ => this.isActive )
      )
      .subscribe( profile => {
        this.tableAsyncProfileService.countPage = profile.totalRows;
        this.profiles = profile.result;
        this.isLoader = false;
      } );
  }

  private isKeys( key: string, exception: string ): boolean {
    switch ( exception ) {
      case 'all':
        return key !== 'locationidfrom'
          && key !== 'locationidto'
          && key !== 'flightdatefrom'
          && key !== 'flightdateto'
          && key !== 'deptimefrominclude'
          && key !== 'deptimetoexclude'
          && key !== 'dobfrominclude'
          && key !== 'dobtoexclude'
          && key !== 'contactsexist';
      case 'data':
        return key === 'flightdatefrom'
          || key === 'flightdateto'
          || key === 'deptimefrominclude'
          || key === 'deptimetoexclude'
          || key === 'dobfrominclude'
          || key === 'dobtoexclude';
      case 'checkbox':
        return key == 'contactsexist';
    }
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
