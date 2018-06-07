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
  public isTableCard: boolean = false;
  public isLoader: boolean = false;

  private autDelay: number = 500;
  private autLength: number = 3;
  private isActive: boolean = true;

  constructor(
    private fb: FormBuilder,
    private profileSearchService: ProfileSearchService,
  ) { }

  ngOnInit(): void {
    this.initCity();
    this.initForm();
    this.initAutocomplete();
    this.initTree();
    this.initGroups();
  }


  sendForm(): void {

    this.isTableCard = true;
    this.isLoader = true;

    console.log( this.formProfileSearch.getRawValue() );

    if ( this.formProfileSearch.dirty) {
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
          console.log(count);
          const paramsAndCount = `from=0&sorttype=1&sortvalue=last_name&count=${count}`;
          this.profileSearchService.getProfileSearch( paramsAndCount )
            .pipe(
              takeWhile( _ => this.isActive ),
              map( ( val: any ) => val.Data )
            )
            .subscribe(
              ( profile: Iprofile[] ) => console.log( profile ),
              err => console.log(err.status)
              )
        } );

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
