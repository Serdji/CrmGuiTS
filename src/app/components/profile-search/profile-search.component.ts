import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Icity } from '../../interface/icity';
import { ProfileSearchService } from './profile-search.service';
import { takeWhile, map, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Itree } from '../../interface/itree';
import { Igroups } from '../../interface/igroups';

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
    } );
  }

  ngOnDestroy() {
    this.isActive = false;
  }

}
