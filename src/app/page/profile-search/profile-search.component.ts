import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Icity } from '../../interface/icity';
import { ProfileSearchService } from './profile-search.service';
import { takeWhile, map, delay } from 'rxjs/operators';
import { Observable, timer } from 'rxjs';
import { Itree } from '../../interface/itree';
import { Igroups } from '../../interface/igroups';
import { Icount } from '../../interface/icount';
import { Iprofile } from '../../interface/iprofile';
import { TableAsyncService } from '../../components/table-async/table-async.service';
import { IpagPage } from '../../interface/ipag-page';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { IprofileSearch } from '../../interface/iprofile-search';

@Component( {
  selector: 'app-profile-search',
  templateUrl: './profile-search.component.html',
  styleUrls: [ './profile-search.component.styl' ]
} )
export class ProfileSearchComponent implements OnInit, OnDestroy {

  public formProfileSearch: FormGroup;
  public cities: Icity[];
  public cityFromOptions: Observable<Icity[]>;
  public cityToOptions: Observable<Icity[]>;
  public trees: Itree[];
  public groups: Igroups[];
  public profiles: Iprofile[];
  public isTableCard: boolean = false;
  public isLoader: boolean = false;

  private paramsPaginatinDefault: any = { sorttype: 1, sortvalue: 'last_name' };
  private autDelay: number = 500;
  private autLength: number = 3;
  private isActive: boolean = true;

  constructor(
    private fb: FormBuilder,
    private profileSearchService: ProfileSearchService,
    private tableAsyncService: TableAsyncService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initCity();
    this.initForm();
    this.initAutocomplete();
    this.initTree();
    this.initGroups();
    this.initTableAsync();
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
    this.tableAsyncService.subjectPage.subscribe( ( value: IpagPage ) => {
      const pageIndex = ( value.pageIndex + 1 ) * value.pageSize;
      const paramsAndCount = Object.assign( this.paramsPaginatinDefault, { from: pageIndex, count: value.pageSize } );
      this.profileSearchService.getProfileSearch( paramsAndCount )
        .pipe(
          takeWhile( _ => this.isActive ),
          map( ( val: any ) => val.Data )
        )
        .subscribe( ( profile: Iprofile[] ) => this.tableAsyncService.setTableDataSource( profile ) );
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

  private initCity() {
    this.profileSearchService.getCity()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: Icity[] ) => {
        this.cities = value;
      } );
  }

  private initAutocomplete() {
    this.cityFromOptions = this.autocomplete( 'cityidfrom' );
    this.cityToOptions = this.autocomplete( 'cityidto' );
  }

  private autocomplete( formControlName: string ): Observable<Icity[]> {
    return this.formProfileSearch.get( formControlName ).valueChanges
      .pipe(
        takeWhile( _ => this.isActive ),
        delay( this.autDelay ),
        map( val => {
          if ( val.length >= this.autLength ) {
            return this.cities.filter( city => city.value.toLowerCase().includes( val.toLowerCase() ) );
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
      cityidfrom: '',
      cityidto: '',
      citydatefrom: '',
      citydateto: '',
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

        for ( const key in value ) {
          if ( key !== 'cityidfrom'
            && key !== 'cityidto'
            && key !== 'divisionid'
            && key !== 'groupid'
            && key !== 'flightdatefrom'
            && key !== 'flightdateto'
            && key !== 'citydatefrom'
            && key !== 'citydateto'
          ) {
            newObjectForm[ key ] = value[ key ];
          }


          if ( key === 'flightdatefrom'
            || key === 'flightdateto'
            || key === 'citydatefrom'
            || key === 'citydateto'
          ) {
            newObjectForm[ key ] = value[ key ] ? new Date( value[ key ].split( '.' ).reverse().join( ',' ) ) : '';
          }

          if ( key === 'cityidfrom'
            || key === 'cityidto'
          ) {
            newObjectForm[ key ] = this.cities.filter( ( city: Icity ) => city.id === +value[ key ] )[ 0 ].value;
          }

          if ( key === 'divisionid' ) newObjectForm[ key ] = this.trees.filter(( trees: Itree ) => trees.ID === +value[ key ] )[ 0 ].Name;
          if ( key === 'groupid' ) newObjectForm[ key ] = this.groups.filter(( groups: Igroups ) => groups.Id === +value[ key ] )[ 0 ].Name;
        }

        this.formProfileSearch.patchValue( newObjectForm );
        this.serverRequest( value );
      }
    } );
  }

  private creatingObjectForm() {

    const params = {};

    for ( const formControlName in this.formProfileSearch.value ) {
      if ( this.formProfileSearch.get( `${ formControlName }` ).value !== ''
        && formControlName !== 'cityidfrom'
        && formControlName !== 'cityidto'
        && formControlName !== 'divisionid'
        && formControlName !== 'groupid'
        && formControlName !== 'flightdatefrom'
        && formControlName !== 'flightdateto'
        && formControlName !== 'citydatefrom'
        && formControlName !== 'citydateto'
      ) {
        params[ formControlName ] = `${this.formProfileSearch.get( formControlName ).value}`;
      }
    }

    const cityidfrom = this.getCityId( 'cityidfrom', this.cities );
    const cityidto = this.getCityId( 'cityidto', this.cities );
    const divisionid = this.getGroupAndDivisionidId( 'divisionid', this.trees, 'ID' );
    const groupid = this.getGroupAndDivisionidId( 'groupid', this.groups, 'Id' );
    const flightdatefrom = this.dateFormat( 'flightdatefrom' );
    const flightdateto = this.dateFormat( 'flightdateto' );
    const citydatefrom = this.dateFormat( 'citydatefrom' );
    const citydateto = this.dateFormat( 'citydateto' );

    const highlightObj = { cityidfrom, cityidto, divisionid, groupid, flightdatefrom, flightdateto, citydatefrom, citydateto };

    for ( const key in highlightObj ) {
      if ( highlightObj[ key ] !== '' && highlightObj[ key ] !== 'Invalid date' ) params[ key ] = highlightObj[ key ];
    }

    this.router.navigate( [ '/crm/profilesearch' ], { queryParams: params } );

    this.serverRequest( params );

  }

  private serverRequest( params: IprofileSearch ) {
    this.isTableCard = true;
    this.isLoader = true;
    this.profileSearchService.getProfileSearchCount( params )
      .pipe(
        takeWhile( _ => this.isActive ),
        map( ( val: Icount ) => val.Data.Id )
      )
      .subscribe( ( count ) => {
        this.tableAsyncService.countPage = +count;
        Object.assign( this.paramsPaginatinDefault, { from: 0, count: 10 } );
        this.profileSearchService.getProfileSearch( this.paramsPaginatinDefault )
          .pipe(
            takeWhile( _ => this.isActive ),
            map( ( val: any ) => val.Data )
          )
          .subscribe(
            ( profile: Iprofile[] ) => {
              this.profiles = profile;
              this.isLoader = false;
            },
          );
      } );
  }


  private getCityId( formControlName: string, params: Icity[] ): any {
    const cityValue = this.formProfileSearch.get( formControlName ).value;
    let cityId;
    if ( cityValue.length >= this.autLength ) {
      cityId = params
        .filter( ( cities: Icity ) => cities.value === cityValue )
        .map( cities => cities.id );
      return cityId[ 0 ];
    }
    return '';
  }

  private getGroupAndDivisionidId( formControlName: string, params: any, keyId: string ): any {
    const formControlNameValue = this.formProfileSearch.get( formControlName ).value;
    let id: number[];
    if ( formControlNameValue.length !== 0 ) {
      id = params
        .filter( ( value: any ) => value.Name === formControlNameValue )
        .map( value => value[ keyId ] );
      return id[ 0 ];
    }
    return '';
  }

  private dateFormat( formControlName: string ) {
    const formControlNameDate = this.formProfileSearch.get( formControlName ).value;
    if ( formControlNameDate.length !== 0 ) {
      const date = moment( formControlNameDate ).format( 'DD.MM.YYYY' );
      return date;
    }
    return '';
  }


  ngOnDestroy(): void {
    this.isActive = false;
  }

}
