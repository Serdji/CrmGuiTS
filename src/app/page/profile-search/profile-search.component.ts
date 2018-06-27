import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Icity } from '../../interface/icity';
import { ProfileSearchService } from './profile-search.service';
import { takeWhile, map, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Itree } from '../../interface/itree';
import { Igroups } from '../../interface/igroups';
import { Icount } from '../../interface/icount';
import { Iprofile } from '../../interface/iprofile';
import { TableAsyncService } from '../../components/table-async/table-async.service';
import { IpagPage } from '../../interface/ipag-page';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';

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
    this.isTableCard = true;
    this.isLoader = true;
    this.creatingObjectForm();
  }

  clearForm(): void {
    this.resetForm();
    this.router.navigate(['/crm/profilesearch'], { queryParams: {} } );
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
    this.cityFromOptions = this.formProfileSearch.get( 'cityfrom' ).valueChanges
      .pipe(
        takeWhile( _ => this.isActive ),
        delay( this.autDelay ),
        map( val => {
          if ( val.length >= this.autLength ) {
            return this.cities.filter( city => city.value.toLowerCase().includes( val.toLowerCase() ) );
          }
        } )
      );
    this.cityToOptions = this.formProfileSearch.get( 'cityto' ).valueChanges
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
      cityfrom: '',
      cityto: '',
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
    this.route.queryParams.subscribe( value => {
      if ( Object.keys( value ).length !== 0 ) {
        this.formProfileSearch.patchValue(value);
        this.sendForm();
      }
    });
  }

  private switchCheckbox() {
    this.formProfileSearch.get( 'withoutcontact' ).valueChanges.subscribe( value => {
      this.formProfileSearch.get( 'email' )[ value ? 'disable' : 'enable' ]();
      this.formProfileSearch.get( 'phone' )[ value ? 'disable' : 'enable' ]();
    } );
  }

  private creatingObjectForm() {

    const params = {};

    for ( const formControlName in this.formProfileSearch.value ) {
      if ( this.formProfileSearch.get( `${ formControlName }` ).value !== ''
        && formControlName !== 'cityfrom'
        && formControlName !== 'cityto'
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

    const cityidfrom = this.getCityIdHighlight( 'cityfrom' );
    const cityidto = this.getCityIdHighlight( 'cityto' );
    const divisionid = this.getGroupAndDivisionidIdHighlight( 'divisionid', this.trees, 'ID' );
    const groupid = this.getGroupAndDivisionidIdHighlight( 'groupid', this.groups, 'Id' );
    const flightdatefrom = this.dateFormatHighlight( 'flightdatefrom' );
    const flightdateto = this.dateFormatHighlight( 'flightdateto' );
    const citydatefrom = this.dateFormatHighlight( 'citydatefrom' );
    const citydateto = this.dateFormatHighlight( 'citydateto' );

    const serializeObj = { cityidfrom, cityidto, divisionid, groupid, flightdatefrom, flightdateto, citydatefrom, citydateto };

    for ( const key in serializeObj ) {
      if ( serializeObj[ key ] !== '' ) params[ key ] = serializeObj[ key ];
    }

    this.router.navigate(['/crm/profilesearch'], { queryParams: params } );

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


  private getCityIdHighlight( formControlName: string ): any {
    const cityValue = this.formProfileSearch.get( formControlName ).value;
    let cityId;
    if ( cityValue.length >= this.autLength ) {
      cityId = this.cities
        .filter( ( cities: Icity ) => cities.value === cityValue )
        .map( cities => cities.id );
      return cityId[ 0 ];
    }
    return '';
  }

  private getGroupAndDivisionidIdHighlight( formControlName: string, params: any, keyId: string ): any {
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

  private dateFormatHighlight( formControlName: string ) {
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
