import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileSearchService } from './profile-search.service';
import { takeWhile, map, delay } from 'rxjs/operators';
import { Observable, timer } from 'rxjs';
import { Iprofiles } from '../../../interface/Iprofiles';
import { TableAsyncProfileService } from '../../../components/tables/table-async-profile/table-async-profile.service';
import { IpagPage } from '../../../interface/ipag-page';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { IprofileSearch } from '../../../interface/iprofile-search';
import { Ilocation } from '../../../interface/ilocation';
import { ListSegmentationService } from '../../segmentation/list-segmentation/list-segmentation.service';
import { ISegmentation } from '../../../interface/isegmentation';
import * as _ from 'lodash';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';

@Component( {
  selector: 'app-profile-search',
  templateUrl: './profile-search.component.html',
  styleUrls: [ './profile-search.component.styl' ]
} )
export class ProfileSearchComponent implements OnInit, OnDestroy {

  public formProfileSearch: FormGroup;
  public locations: Ilocation[];
  public locationFromOptions: Observable<Ilocation[]>;
  public locationToOptions: Observable<Ilocation[]>;
  public segmentationOptions: Observable<ISegmentation[]>;
  public profiles: Iprofiles;
  public isTableCard: boolean = false;
  public isLoader: boolean = false;
  public segmentation: ISegmentation[];

  public segmentationSelectable = true;
  public segmentationRemovable = true;
  public addSegmentationOnBlur = false;
  public separatorKeysCodes: number[] = [ ENTER, COMMA ];
  public segmentationChips: string[] = [];

  private autDelay: number = 500;
  private isActive: boolean = true;
  private sendProfileParams: IprofileSearch;

  @ViewChild( 'segmentationChipInput' ) fruitInput: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private profileSearchService: ProfileSearchService,
    private tableAsyncProfileService: TableAsyncProfileService,
    private listSegmentationService: ListSegmentationService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initLocation();
    this.initForm();
    this.formDisable();
    this.initAutocomplete();
    this.initTableAsync();
    this.initSegmentation();
    this.profileSearchService.subjectDeleteProfile
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => this.serverRequest( this.sendProfileParams ) );
  }


  sendForm(): void {
    this.creatingObjectForm();
  }

  clearForm(): void {
    this.resetForm();
    this.router.navigate( [ '/crm/profilesearch' ], { queryParams: {} } );
  }

  private resetForm() {
    this.segmentationChips = [];
    for ( const formControlName in this.formProfileSearch.value ) {
      this.formProfileSearch.get( `${ formControlName }` ).patchValue( '' );
      this.formProfileSearch.get( `${ formControlName }` ).setErrors( null );
    }
  }

  private initTableAsync() {
    this.tableAsyncProfileService.subjectPage
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;
        const paramsAndCount = Object.assign( this.sendProfileParams, { sortvalue: 'last_name', from: pageIndex, count: value.pageSize } );
        this.profileSearchService.getProfileSearch( paramsAndCount )
          .pipe( takeWhile( _ => this.isActive ) )
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

  private initSegmentation() {
    this.listSegmentationService.getSegmentation()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: ISegmentation[] ) => {
        this.segmentation = value;
      } );
  }

  private initAutocomplete() {
    this.locationFromOptions = this.autocomplete( 'deppoint', 'location' );
    this.locationToOptions = this.autocomplete( 'arrpoint', 'location' );
    this.segmentationOptions = this.autocomplete( 'segmentationIds', 'segmentation' );
  }

  private autocomplete( formControlName: string, options: string ): Observable<any> {
    return this.formProfileSearch.get( formControlName ).valueChanges
      .pipe(
        takeWhile( _ => this.isActive ),
        delay( this.autDelay ),
        map( val => {
          switch ( options ) {
            case 'location':
              return this.locations.filter( location => location.locationCode.toLowerCase().includes( val.toLowerCase() ) );
            case 'segmentation':
              return this.segmentation.filter( segmentation => {
                  if ( val !== null ) return segmentation.title.toLowerCase().includes( val.toLowerCase() );
                }
              );
          }
        } )
      );
  }

  add( event: MatChipInputEvent, formControlName: string ): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ( ( value || '' ).trim() ) {
      this.segmentationChips.push( value.trim() );
    }

    // Reset the input value
    if ( input ) {
      input.value = '';
    }

    this.formProfileSearch.get( formControlName ).setValue( null );
  }

  remove( textChip: string, arrayChips: string[] ): void {
    const index = arrayChips.indexOf( textChip );

    if ( index >= 0 ) {
      this.segmentationChips.splice( index, 1 );
    }
  }

  selected( event: MatAutocompleteSelectedEvent, formControlName: string ): void {
    this.segmentationChips.push( event.option.viewValue );
    this.fruitInput.nativeElement.value = '';
    this.formProfileSearch.get( formControlName ).setValue( null );
  }


  private initForm() {
    this.formProfileSearch = this.fb.group( {
      lastname: '',
      firstname: '',
      customerid: '',
      gender: '',
      segmentationIds: '',
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
      rbd: '',
      tariffcode: '',
      servicecode: '',
      moneyamountfrominclude: '',
      moneyamounttoinclude: '',
      amountdatefrom: '',
      amountdateto: '',
      contactemail: '',
      contactphone: '',
      contactsexist: '',
      id: '',
    }, {
      updateOn: 'submit',
    } );
    this.switchCheckbox();
    timer( 500 )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => this.formFilling() );
  }

  private formDisable() {
    this.formProfileSearch.get( 'tariffcode' ).disable();
    this.formProfileSearch.get( 'id' ).disable();
    this.formProfileSearch.get( 'amountdatefrom' ).disable();
    this.formProfileSearch.get( 'amountdateto' ).disable();
  }

  private switchCheckbox() {
    this.formProfileSearch.get( 'contactsexist' ).valueChanges
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( value => {
        this.formProfileSearch.get( 'contactemail' )[ value ? 'disable' : 'enable' ]();
        this.formProfileSearch.get( 'contactphone' )[ value ? 'disable' : 'enable' ]();
        if ( value ) {
          this.formProfileSearch.get( 'contactemail' ).patchValue( '' );
          this.formProfileSearch.get( 'contactphone' ).patchValue( '' );
        }
      } );
  }

  private formFilling() {
    this.route.queryParams
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( value => {
          if ( Object.keys( value ).length !== 0 ) {

            const newObjectForm = {};
            const segmentationTitles = [];

            if ( value.segmentation ) {
              for ( const segmentation of value.segmentation ) {
                segmentationTitles.push( _.chain( this.segmentation ).find( { 'segmentationId': +segmentation } ).result( 'title' ).value() );
              }
            }

            this.segmentationChips = segmentationTitles;

            for ( const key of Object.keys( value ) ) {
              if ( this.isKeys( key, 'all' ) ) newObjectForm[ key ] = value[ key ];
              if ( this.isKeys( key, 'data' ) ) newObjectForm[ key ] = value[ key ] ? new Date( value[ key ].split( '.' ).reverse().join( ',' ) ) : '';
              if ( this.isKeys( key, 'checkbox' ) ) newObjectForm[ key ] = value[ key ];
            }

            this.formProfileSearch.patchValue( newObjectForm );
            this.creatingObjectForm();
          }
        }
      );
  }

  private creatingObjectForm() {
    const params = {};
    const highlightObj = {};
    const formValue = Object.keys( this.formProfileSearch.value );
    const segmentationIds = [];

    for ( const segmentationChip of this.segmentationChips ) {
      segmentationIds.push( _.chain( this.segmentation ).find( { 'title': segmentationChip } ).result( 'segmentationId' ).value() );
    }

    for ( const key of formValue ) {
      if ( this.isKeys( key, 'all' ) ) highlightObj[ key ] = `${this.formProfileSearch.get( key ).value.trim()}`;
      if ( this.isKeys( key, 'segmentationIds' ) ) highlightObj[ key ] = segmentationIds;
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
      .pipe( takeWhile( _ => this.isActive ) )
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
          && key !== 'segmentationIds'
          && key !== 'contactsexist';
      case 'data':
        return key === 'flightdatefrom'
          || key === 'flightdateto'
          || key === 'deptimefrominclude'
          || key === 'deptimetoexclude'
          || key === 'dobfrominclude'
          || key === 'dobtoexclude';
      case 'checkbox':
        return key === 'contactsexist';
      case 'segmentationIds':
        return key === 'segmentationIds';
    }
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
