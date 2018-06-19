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
import { log } from 'util';

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

  private paramsPaginatinDefault: string = `&sorttype=1&sortvalue=last_name`;
  private autDelay: number = 500;
  private autLength: number = 3;
  private isActive: boolean = true;

  constructor(
    private fb: FormBuilder,
    private profileSearchService: ProfileSearchService,
    private tableAsyncService: TableAsyncService,
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
    if ( this.formProfileSearch.dirty ) {
      this.isTableCard = true;
      this.isLoader = true;
      this.serializeForm();
    }
  }

  clearForm(): void {
    this.resetForm();
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
      const paramsAndCount = `${ this.paramsPaginatinDefault }&from=${ pageIndex }&count=${ value.pageSize }`;
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
      withoutcontact: false,
      id: '',
    }, {
      updateOn: 'submit',
    } );

    this.switchСheckbox();
  }

  private switchСheckbox() {
    this.formProfileSearch.get( 'withoutcontact' ).valueChanges.subscribe( value => {
      this.formProfileSearch.get( 'email' )[ value ? 'disable' : 'enable' ]();
      this.formProfileSearch.get( 'phone' )[ value ? 'disable' : 'enable' ]();
    } );
  }

  private serializeForm() {

    let params: string = '?';
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
        params += `${ formControlName }=${this.formProfileSearch.get( formControlName ).value}&`;
      }
    }

    const cityIdFrom: string = this.getCityIdSerialize( 'cityfrom' );
    const cityIdTo: string = this.getCityIdSerialize( 'cityto' );
    const divisionId: string = this.getGroupAndDivisionidIdSerialize( 'divisionid', this.trees, 'ID' );
    const groupTd: string = this.getGroupAndDivisionidIdSerialize( 'groupid', this.groups, 'Id' );
    const flightDateFrom: string = this.dateFormatSerialize( 'flightdatefrom' );
    const flightDateTo: string = this.dateFormatSerialize( 'flightdateto' );
    const cityDateFrom: string = this.dateFormatSerialize( 'citydatefrom' );
    const cityDateTo: string = this.dateFormatSerialize( 'citydateto' );

    params += `${cityIdFrom}${cityIdTo}${divisionId}${groupTd}${flightDateFrom}${flightDateTo}${cityDateFrom}${cityDateTo}`;
    this.profileSearchService.getProfileSearchCount( params )
      .pipe(
        takeWhile( _ => this.isActive ),
        map( ( val: Icount ) => val.Data.Id )
      )
      .subscribe( ( count ) => {
        this.tableAsyncService.countPage = +count;
        this.profileSearchService.getProfileSearch( `${this.paramsPaginatinDefault}&from=0&count=10` )
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


  private getCityIdSerialize( formControlName: string ): string {
    const cityValue = this.formProfileSearch.get( formControlName ).value;
    let cityId;
    if ( cityValue.length >= this.autLength ) {
      cityId = this.cities
        .filter( ( cities: Icity ) => cities.value === cityValue )
        .map( cities => cities.id );
      return `${formControlName}=${cityId[ 0 ]}&`;
    }
    return '';
  }

  private getGroupAndDivisionidIdSerialize( formControlName: string, params: any, keyId: string ): string {
    const formControlNameValue = this.formProfileSearch.get( formControlName ).value;
    let id: number[];
    if ( formControlNameValue.length !== 0 ) {
      id = params
        .filter( ( value: any ) => value.Name === formControlNameValue )
        .map( value => value[ keyId ] );
      return `${formControlName}=${id[ 0 ]}&`;
    }
    return '';
  }

  private dateFormatSerialize( formControlName: string ) {
    const formControlNameDate = this.formProfileSearch.get( formControlName ).value;
    if ( formControlNameDate.length !== 0 ) {
      const date = moment( formControlNameDate ).format( 'DD.MM.YYYY' );
      return `${formControlName}=${date}&`;
    }
    return '';
  }


  ngOnDestroy(): void {
    this.isActive = false;
  }

}
