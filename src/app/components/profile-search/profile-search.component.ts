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
import { TableAsyncService } from '../../shared/table-async/table-async.service';
import { IpagPage } from '../../interface/ipag-page';

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

    this.isTableCard = true;
    this.isLoader = true;

    if ( this.formProfileSearch.dirty ) {
      let params = '?';
      for ( const formControlName in this.formProfileSearch.value ) {
        if ( this.formProfileSearch.get( `${formControlName}` ).value !== '' ) {
          params += `${formControlName}=${this.formProfileSearch.get( formControlName ).value}&`;
        }
      }

      this.profileSearchService.getProfileSearchCount( params )
        .pipe(
          takeWhile( _ => this.isActive ),
          map( ( val: any ) => val.Data.Id )
        )
        .subscribe( ( count: Icount[] ) => {
          this.tableAsyncService.countPage = +count;
          const paramsAndCount = `from=0&sorttype=1&sortvalue=last_name&count=10`;
          this.profileSearchService.getProfileSearch( paramsAndCount )
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
  }

  clearForm(): void {
    this.resetForm();
  }

  private initTableAsync() {
    this.tableAsyncService.subjectPage.subscribe( ( value: IpagPage ) => {
      const paramsAndCount = `from=${ ( value.pageIndex + 1 ) * 10}&sorttype=1&sortvalue=last_name&count=10`;
      this.profileSearchService.getProfileSearch( paramsAndCount )
        .pipe(
          takeWhile( _ => this.isActive ),
          map( ( val: any ) => val.Data )
        )
        .subscribe( ( profile: Iprofile[] ) => this.tableAsyncService.setTableDataSource( profile ) );
    } );
  }

  private resetForm() {
    for ( const formControlName in this.formProfileSearch.value ) {
      this.formProfileSearch.get( `${ formControlName }` ).patchValue( '' );
      this.formProfileSearch.get( `${ formControlName }` ).setErrors( null );
    }
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
      .subscribe( ( value: Icity[] ) => this.cities = value );
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
    this.formProfileSearch.get( 'withoutcontact' ).valueChanges.subscribe( value => {
      this.formProfileSearch.get( 'email' )[ value ? 'disable' : 'enable' ]();
      this.formProfileSearch.get( 'phone' )[ value ? 'disable' : 'enable' ]();
    } );
  }

  ngOnDestroy() {
    this.isActive = false;
  }

}
