import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Icity } from '../../interface/icity';
import { ProfileSearchService } from './profile-search.service';
import { takeWhile, map, startWith, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component( {
  selector: 'app-profile-search',
  templateUrl: './profile-search.component.html',
  styleUrls: [ './profile-search.component.styl' ]
} )
export class ProfileSearchComponent implements OnInit, OnDestroy {

  public formProfileSearch: FormGroup;
  public citys: Icity[];
  public cityFromOptions: Observable<Icity[]>;
  public cityToOptions: Observable<Icity[]>;

  private isActive: boolean = true;

  constructor(
    private fb: FormBuilder,
    private profileSearchService: ProfileSearchService,
  ) { }

  ngOnInit(): void {
    this.initCity();
    this.initForm();
    this.initAutocomplete();
  }

  private initAutocomplete() {
    this.cityFromOptions = this.formProfileSearch.get( 'cityfrom' ).valueChanges
      .pipe(
        takeWhile( _ => this.isActive ),
        delay(1000),
        map( val => {
          if ( val.length < 3 ) return;
          return this.citys.filter( city => {
            return city.value.toLowerCase().includes( val.toLowerCase() );
          });
        } )
      );
    this.cityToOptions = this.formProfileSearch.get( 'cityto' ).valueChanges
      .pipe(
        takeWhile( _ => this.isActive ),
        delay(1000),
        map( val => {
          if ( val.length < 3 ) return;
          return this.citys.filter( city => {
            return city.value.toLowerCase().includes( val.toLowerCase() );
          });
        } )
      );
  }

  private initCity() {
    this.profileSearchService.getCity()
      .pipe(
        takeWhile( _ => this.isActive ),
        // map( city => city.slice( 0, 10 ) )
      )
      .subscribe( ( value: Icity[] ) => this.citys = value );
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
    } );
  }

  ngOnDestroy() {
    this.isActive = false;
  }

}
