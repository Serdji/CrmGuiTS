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
import { saveAs } from 'file-saver';
import { ProfileGroupService } from '../../special-groups/profile-group/profile-group.service';
import { IcustomerGroup } from '../../../interface/icustomer-group';

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
  public customerGroupOptions: Observable<ISegmentation[]>;
  public profiles: Iprofiles;
  public isTableCard: boolean = false;
  public isLoader: boolean = false;
  public segmentation: ISegmentation[];
  public customerGroup: IcustomerGroup[];

  public segmentationSelectable = true;
  public segmentationRemovable = true;
  public addSegmentationOnBlur = false;
  public separatorKeysCodes: number[] = [ ENTER, COMMA ];
  public segmentationChips: string[] = [];
  public customerGroupSelectable = true;
  public customerGroupRemovable = true;
  public addCustomerGroupOnBlur = false;
  public customerGroupChips: string[] = [];

  private autDelay: number = 500;
  private isActive: boolean = true;
  private sendProfileParams: IprofileSearch;

  @ViewChild( 'segmentationChipInput' ) segmentationFruitInput: ElementRef<HTMLInputElement>;
  @ViewChild( 'customerGroupChipInput' ) customerGroupFruitInput: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private profileSearchService: ProfileSearchService,
    private tableAsyncProfileService: TableAsyncProfileService,
    private listSegmentationService: ListSegmentationService,
    private profileGroupService: ProfileGroupService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initLocation();
    this.initForm();
    this.initAutocomplete();
    this.initTableAsync();
    this.initSegmentation();
    this.initCustomerGroup();
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

  downloadCsv(): void {
    this.profileSearchService.downloadCsv( this.sendProfileParams )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( resp => {
        const filename = resp.headers.get( 'content-disposition' ).split( ';' )[ 1 ].split( '=' )[ 1 ];
        saveAs( resp.body, filename );
      } );
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
      .subscribe( ( segmentation: ISegmentation[] ) => {
        this.segmentation = segmentation;
      } );
  }

  private initCustomerGroup() {
    this.profileGroupService.getProfileGroup()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( customerGroup: IcustomerGroup[] ) => {
        this.customerGroup = customerGroup;
      } );
  }

  private initAutocomplete() {
    this.locationFromOptions = this.autocomplete( 'deppoint', 'location' );
    this.locationToOptions = this.autocomplete( 'arrpoint', 'location' );
    this.segmentationOptions = this.autocomplete( 'segmentation', 'segmentation' );
    this.customerGroupOptions = this.autocomplete( 'customerGroup', 'customerGroup' );
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
              case 'customerGroup':
              return this.customerGroup.filter( customerGroup => {
                  if ( val !== null ) return customerGroup.customerGroupName.toLowerCase().includes( val.toLowerCase() );
                }
              );
          }
        } )
      );
  }

  add( event: MatChipInputEvent, formControlName: string, chips: string ): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ( ( value || '' ).trim() ) {
      this[chips].push( value.trim() );
    }

    // Reset the input value
    if ( input ) {
      input.value = '';
    }

    this.formProfileSearch.get( formControlName ).setValue( null );
  }

  remove( textChip: string, arrayChips: string[], chips ): void {
    const index = arrayChips.indexOf( textChip );

    if ( index >= 0 ) {
      this[chips].splice( index, 1 );
    }
  }

  selected( event: MatAutocompleteSelectedEvent, formControlName: string, chips: string, fruitInput: string ): void {
    this[chips].push( event.option.viewValue );
    this[fruitInput].nativeElement.value = '';
    this.formProfileSearch.get( formControlName ).setValue( null );
  }


  private initForm() {
    this.formProfileSearch = this.fb.group( {
      lastname: '',
      firstname: '',
      customerids: '',
      gender: '',
      segmentation: '',
      customerGroup: '',
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
      farecode: '',
      servicecode: '',
      moneyamountfrominclude: '',
      moneyamounttoinclude: '',
      bookingcreatedatefrominclude: '',
      bookingcreatedatetoexclude: '',
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
            const customerGroupTitles = [];

            if ( value.segmentationIds ) {
              const segmentationIds = !_.isArray( value.segmentationIds ) ? _.castArray( value.segmentationIds ) : value.segmentationIds;
              for ( const segmentationId of segmentationIds ) {
                if ( segmentationId ) {
                  segmentationTitles.push( _.chain( this.segmentation ).find( { 'segmentationId': +segmentationId } ).result( 'title' ).value() );
                }
              }
            }

            if ( value.customerGroupIds ) {
              const customerGroupIds = !_.isArray( value.customerGroupIds ) ? _.castArray( value.customerGroupIds ) : value.customerGroupIds;
              for ( const customerGroupId of customerGroupIds ) {
                if ( customerGroupId ) {
                  customerGroupTitles.push( _.chain( this.customerGroup ).find( { 'customerGroupId': +customerGroupId } ).result( 'customerGroupName' ).value() );
                }
              }
            }

            this.segmentationChips = segmentationTitles;
            this.customerGroupChips = customerGroupTitles;

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
    const segmentation = [];
    const customerGroup = [];

    for ( const segmentationChip of this.segmentationChips ) {
      if ( segmentationChip ) {
        segmentation.push( _.chain( this.segmentation ).find( { 'title': segmentationChip } ).result( 'segmentationId' ).value() );
      }
    }

    for ( const customerGroupChip of this.customerGroupChips ) {
      if ( customerGroupChip ) {
        customerGroup.push( _.chain( this.customerGroup ).find( { 'customerGroupName': customerGroupChip } ).result( 'customerGroupId' ).value() );
      }
    }

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

    if ( _.size( segmentation ) > 0 ) {
      _.set( params, 'segmentationIds', segmentation );
    }

    if ( _.size( customerGroup ) > 0 ) {
      _.set( params, 'customerGroupIds', customerGroup );
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
          && key !== 'segmentation'
          && key !== 'customerGroup'
          && key !== 'deptimefrominclude'
          && key !== 'deptimetoexclude'
          && key !== 'dobfrominclude'
          && key !== 'dobtoexclude'
          && key !== 'dobtoexclude'
          && key !== 'bookingcreatedatefrominclude'
          && key !== 'bookingcreatedatetoexclude'
          && key !== 'contactsexist';
      case 'data':
        return key === 'flightdatefrom'
          || key === 'flightdateto'
          || key === 'deptimefrominclude'
          || key === 'deptimetoexclude'
          || key === 'dobfrominclude'
          || key === 'dobtoexclude'
          || key === 'bookingcreatedatefrominclude'
          || key === 'bookingcreatedatetoexclude';
      case 'checkbox':
        return key === 'contactsexist';
    }
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
