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

@Component( {
  selector: 'app-profile-search',
  templateUrl: './profile-search.component.html',
  styleUrls: [ './profile-search.component.styl' ]
} )
export class ProfileSearchComponent implements OnInit, OnDestroy {

  public formProfileSearch: FormGroup;
  public countrys: Icountry[];
  public countryFromOptions: Observable<Icountry[]>;
  public countryToOptions: Observable<Icountry[]>;
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
    this.initCountry();
    this.initForm();
    this.initAutocomplete();
    this.initTree();
    this.initGroups();
    this.initTableAsync();
    this.profileSearchService.subjectDeleteProfile.subscribe( _=> this.serverRequest(this.sendProfileParams));
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
      const paramsAndCount = Object.assign( this.sendProfileParams,{ sortvalue: 'last_name', from: pageIndex, count: value.pageSize } );
      this.profileSearchService.getProfileSearch( paramsAndCount )
        .pipe(
          takeWhile( _ => this.isActive )
        )
        .subscribe( ( profile: Iprofiles ) => this.tableAsyncProfileService.setTableDataSource( profile.result ) );
    } );
  }


  private initTree() {
    this.profileSearchService.getTree()
      .pipe(
        takeWhile( _ => this.isActive ),
        map( ( val: any ) => val.Data )
      )
      .subscribe( ( value: Itree[] ) => this.trees = value );
  }

  private initGroups() {
    this.profileSearchService.getGroups()
      .pipe(
        takeWhile( _ => this.isActive ),
        map( ( val: any ) => val.Data )
      )
      .subscribe( ( value: Igroups[] ) => this.groups = value );
  }

  private initCountry() {
    this.profileSearchService.getCountry()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: Icountry[] ) => {
        this.countrys = value;
      } );
  }

  private initAutocomplete() {
    this.countryFromOptions = this.autocomplete( 'countryidfrom' );
    this.countryToOptions = this.autocomplete( 'countryidto' );
  }

  private autocomplete( formControlName: string ): Observable<Icountry[]> {
    return this.formProfileSearch.get( formControlName ).valueChanges
      .pipe(
        takeWhile( _ => this.isActive ),
        delay( this.autDelay ),
        map( val => {
          if ( val.length >= this.autLength ) {
            return this.countrys.filter( country => country.rName.toLowerCase().includes( val.toLowerCase() ) );
          }
        } )
      );
  }

  private initForm() {
    this.formProfileSearch = this.fb.group( {
      lastname: '',
      firstname: '',
      ticketnum: '',
      booknum: '',
      emdnum: '',
      flightnum: '',
      flightdatefrom: '',
      flightdateto: '',
      countryidfrom: '',
      countryidto: '',
      countrydatefrom: '',
      countrydateto: '',
      divisionid: '',
      groupid: '',
      amountfrom: '',
      amountto: '',
      email: '',
      phone: '',
      withoutcontact: '',
      id: '',
    }, {
      updateOn: 'submit',
    } );
    this.switchCheckbox();
    timer( 500 ).subscribe( _ => this.formFilling() );
  }

  private switchCheckbox() {
    this.formProfileSearch.get( 'withoutcontact' ).valueChanges.subscribe( value => {
      this.formProfileSearch.get( 'email' )[ value ? 'disable' : 'enable' ]();
      this.formProfileSearch.get( 'phone' )[ value ? 'disable' : 'enable' ]();
    } );
  }

  private formFilling() {
    this.route.queryParams.subscribe( value => {
      if ( Object.keys( value ).length !== 0 ) {

        const newObjectForm = {};

        for ( const key of Object.keys( value ) ) {
          if ( this.isKeys( key, 'all' ) ) newObjectForm[ key ] = value[ key ];
          if ( this.isKeys( key, 'data' ) ) newObjectForm[ key ] = value[ key ] ? new Date( value[ key ].split( '.' ).reverse().join( ',' ) ) : '';
          if ( this.isKeys( key, 'country' ) ) newObjectForm[ key ] = this.countrys.filter( ( country: Icountry ) => country.idCountry === +value[ key ] )[ 0 ].rName;
          if ( key === 'divisionid' ) newObjectForm[ key ] = this.trees.filter( ( trees: Itree ) => trees.ID === +value[ key ] )[ 0 ].Name;
          if ( key === 'groupid' ) newObjectForm[ key ] = this.groups.filter( ( groups: Igroups ) => groups.Id === +value[ key ] )[ 0 ].Name;
        }

        this.formProfileSearch.patchValue( newObjectForm );
        this.serverRequest( newObjectForm );
      }
    } );
  }

  private creatingObjectForm() {
    const params = {};
    const highlightObj = {};
    const formValue = Object.keys( this.formProfileSearch.value );

    for ( const key of formValue ) {
      if ( this.isKeys( key, 'all' ) ) highlightObj[ key ] = `${this.formProfileSearch.get( key ).value}`;
      if ( this.isKeys( key, 'data' ) ) highlightObj[ key ] = moment( this.formProfileSearch.get( key ).value ).format( 'DD.MM.YYYY' );
      if ( this.isKeys( key, 'country' ) ) highlightObj[ key ] = this.formProfileSearch.get( key ).value ?
        this.countrys.filter( ( country: Icountry ) => country.rName === this.formProfileSearch.get( key ).value )[ 0 ].idCountry : '';
      if ( key === 'divisionid' ) highlightObj[ key ] = this.formProfileSearch.get( key ).value ?
        this.trees.filter( ( trees: Itree ) => trees.Name === this.formProfileSearch.get( key ).value )[ 0 ].ID : '';
      if ( key === 'groupid' ) highlightObj[ key ] = this.formProfileSearch.get( key ).value ?
        this.groups.filter( ( groups: Igroups ) => groups.Name === this.formProfileSearch.get( key ).value )[ 0 ].Id : '';
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
      .subscribe(  profile => {
        this.tableAsyncProfileService.countPage = profile.totalRows;
        this.profiles = profile.result;
        this.isLoader = false;
      } );
  }

  private isKeys( key: string, exception: string ): boolean {
    switch ( exception ) {
      case 'all':
        return key !== 'countryidfrom'
          && key !== 'countryidto'
          && key !== 'divisionid'
          && key !== 'groupid'
          && key !== 'flightdatefrom'
          && key !== 'flightdateto'
          && key !== 'countrydatefrom'
          && key !== 'countrydateto';
      case 'data':
        return key === 'flightdatefrom'
          || key === 'flightdateto'
          || key === 'countrydatefrom'
          || key === 'countrydateto';
      case 'country':
        return key === 'countryidfrom'
          || key === 'countryidto';
    }
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
