import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { debounceTime, map, switchMap} from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { ICity } from '../../../interface/icity';
import { AddPromotionsService } from '../add-promotions/add-promotions.service';
import { IPromotions } from '../../../interface/ipromotions';
import * as _ from 'lodash';
import * as R from 'ramda';
import * as moment from 'moment';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { ProfileSearchService } from '../../profiles/profile-search/profile-search.service';
import { ISegmentation } from '../../../interface/isegmentation';
import { IcustomerGroup } from '../../../interface/icustomer-group';
import { ListSegmentationService } from '../../segmentation/list-segmentation/list-segmentation.service';
import { ProfileGroupService } from '../../special-groups/profile-group/profile-group.service';
import { AddPromotionsCodesService } from './add-promotions-codes.service';
import { IPromoCodesValTypes } from '../../../interface/ipromo-code-val-types';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { IPromoCode, IPromoCodes } from '../../../interface/ipromo-code';
import { IProfilePromoCode } from '../../../interface/iprofile-promo-code';
import { TableAsyncService } from '../../../services/table-async.service';
import { IpagPage } from '../../../interface/ipag-page';
import { promotionValidatorAsync } from '../../../validators/promotionValidatorAsync';
import { IPromoCodesAdd } from '../../../interface/ipromo-code-add';
import { IChipsCustomerList } from '../../../interface/ichips-customer-list';
import { SaveUrlServiceService } from '../../../services/save-url-service.service';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component( {
  selector: 'app-add-promotions-codes',
  templateUrl: './add-promotions-codes.component.html',
  styleUrls: [ './add-promotions-codes.component.styl' ]
} )
export class AddPromotionsCodesComponent implements OnInit, OnDestroy {

  public isLoader: boolean;
  public formPromoCodes: FormGroup;
  public promotions: IPromotions;
  public segmentation: ISegmentation[];
  public customerGroup: IcustomerGroup[];
  public promotionsOptions: Observable<IPromotions[]>;
  public citiesFromOptions: Observable<ICity[]>;
  public citiesToOptions: Observable<ICity[]>;
  public segmentationOptions: Observable<ISegmentation[]>;
  public customerGroupOptions: Observable<IcustomerGroup[]>;
  readonly separatorKeysCodes: number[] = [ ENTER, COMMA, SPACE ];
  public promoCodeRouteList: any[] = [];
  public promoCodeValTypes: IPromoCodesValTypes;
  public profilePromoCode: IProfilePromoCode;

  public promoCodeFlightListSelectable = true;
  public promoCodeFlightListRemovable = true;
  public addPromoCodeFlightListOnBlur = true;
  public promoCodeFlightListChips: string[] = [];

  public promoCodeBrandListSelectable = true;
  public promoCodeBrandListRemovable = true;
  public addPromoCodeBrandListOnBlur = true;
  public promoCodeBrandListChips: string[] = [];

  public promoCodeRbdListSelectable = true;
  public promoCodeRbdListRemovable = true;
  public addPromoCodeRbdListOnBlur = true;
  public promoCodeRbdListChips: string[] = [];

  public promoCodeCustomerListSelectable = true;
  public promoCodeCustomerListRemovable = true;
  public addPromoCodeCustomerListOnBlur = true;
  public promoCodeCustomerListChips: IChipsCustomerList[] = [];

  public segmentationSelectable = true;
  public segmentationRemovable = true;
  public addSegmentationOnBlur = false;
  public segmentationChips: string[] = [];

  public customerGroupSelectable = true;
  public customerGroupRemovable = true;
  public addCustomerGroupOnBlur = false;
  public customerGroupChips: string[] = [];

  public buttonSave: boolean;
  public buttonCreate: boolean;
  public buttonCopy: boolean;
  public buttonDelete: boolean;
  public buttonSearch: boolean;
  public isTable: boolean;

  public progressBar: number;
  public usesFact: number;
  public usesTotal: number;

  private autDelay: number;
  private promoCodeId: number;
  private arrCustomerIds: number[] = [];
  private promoCodeFlightListRegexp: RegExp = new RegExp( '^\\w+-\\d{1,6}([a-zA-Z](?!\\d))?$' );

  @ViewChild( 'promoCodeFlightListChipInput', { static: true } ) promoCodeFlightListInput: ElementRef<HTMLInputElement>;
  @ViewChild( 'promoCodeBrandListChipInput', { static: true } ) promoCodeBrandListInput: ElementRef<HTMLInputElement>;
  @ViewChild( 'promoCodeRbdListChipInput', { static: true } ) promoCodeRbdListInput: ElementRef<HTMLInputElement>;
  @ViewChild( 'promoCodeCustomerListChipInput', { static: true } ) promoCodeCustomerListInput: ElementRef<HTMLInputElement>;
  @ViewChild( 'segmentationChipInput', { static: true } ) segmentationFruitInput: ElementRef<HTMLInputElement>;
  @ViewChild( 'customerGroupChipInput', { static: true } ) customerGroupFruitInput: ElementRef<HTMLInputElement>;


  constructor(
    private fb: FormBuilder,
    private addPromotionsService: AddPromotionsService,
    private addPromotionsCodesService: AddPromotionsCodesService,
    private profileSearchService: ProfileSearchService,
    private listSegmentationService: ListSegmentationService,
    private profileGroupService: ProfileGroupService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private tableAsyncService: TableAsyncService,
    private saveUrlServiceService: SaveUrlServiceService,
  ) { }

  ngOnInit(): void {
    this.buttonSave = false;
    this.buttonCopy = true;
    this.buttonCreate = true;
    this.buttonDelete = true;
    this.buttonSearch = true;
    this.progressBar = 0;

    this.isLoader = true;
    this.autDelay = 500;
    this.initFormPromoCodes();
    this.initAutocomplete();
    this.initPromotions();
    this.initCities();
    this.initSegmentation();
    this.initCustomerGroup();
    this.initPromoCodeValTypes();
    this.initQueryParams();
    this.initTableProfilePagination();
    this.addPromotionsCodesService.subjectDeletePromotionsCodes
      .pipe( untilDestroyed( this ) )
      .subscribe( _ => this.clearForm() );
    this.saveUrlServiceService.subjectEvent401
      .pipe( untilDestroyed( this ) )
      .subscribe( _ => {
        this.router.navigate( [ '/crm/add-promotions-codes' ], { queryParams: { saveFormParams: JSON.stringify( this.promoCodeParameters() ) } } );
      } );
  }

  private initQueryParams() {
    const hasSaveFormParams = R.has( 'saveFormParams' );
    const hasPromoCodeId = R.has( 'promoCodeId' );
    this.route.queryParams
      .pipe( untilDestroyed( this ) )
      .subscribe( params => {
        if ( hasPromoCodeId( params ) ) {
          this.buttonSave = true;
          this.buttonCopy = false;
          this.buttonCreate = false;
          this.buttonDelete = false;
          this.buttonSearch = false;
          this.promoCodeId = +params.promoCodeId;
          this.formFilling( this.promoCodeId );
        } else if ( hasSaveFormParams( params ) ) {
          this.saveForm( params );
        }
      } );
  }

  private initCities() {
    this.citiesFromOptions = this.formPromoCodes.get('dep_Location').valueChanges
      .pipe(
        debounceTime( this.autDelay ),
        switchMap( text => this.profileSearchService.getCities( text ) )
      ) as Observable<ICity[]>;
    this.citiesToOptions = this.formPromoCodes.get('arr_Location').valueChanges
      .pipe(
        debounceTime( this.autDelay ),
        switchMap( text => this.profileSearchService.getCities( text ) )
      ) as Observable<ICity[]>;

  }

  private initSegmentation() {
    this.listSegmentationService.getSegmentation()
      .pipe( untilDestroyed( this ) )
      .subscribe( ( segmentation: ISegmentation[] ) => {
        this.segmentation = segmentation;
      } );
  }

  private initCustomerGroup() {
    this.profileGroupService.getProfileGroup()
      .pipe( untilDestroyed( this ) )
      .subscribe( ( customerGroup: IcustomerGroup[] ) => {
        this.customerGroup = customerGroup;
      } );
  }

  private initPromoCodeValTypes() {
    this.addPromotionsCodesService.getPromoCodeValTypes()
      .pipe( untilDestroyed( this ) )
      .subscribe( ( promoCodeValTypes: IPromoCodesValTypes ) => this.promoCodeValTypes = promoCodeValTypes );
  }

  private initPromotions() {
    const params = {
      from: 0,
      count: 10000
    };
    this.addPromotionsService.getAllPromotions( params )
      .pipe( untilDestroyed( this ) )
      .subscribe( ( promotions: IPromotions ) => this.promotions = promotions );
  }


  private initTableProfilePagination() {
    this.tableAsyncService.subjectPage
      .pipe( untilDestroyed( this ) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;
        const paramsAndCount = {
          promoCodeId: this.promoCodeId,
          from: pageIndex,
          count: value.pageSize,
          sortvalue: 'last_name'
        };
        this.addPromotionsCodesService.getProfiles( paramsAndCount )
          .pipe( untilDestroyed( this ) )
          .subscribe( ( profilePromoCode: IProfilePromoCode ) => this.tableAsyncService.setTableDataSource( profilePromoCode.result ) );
      } );
  }

  private initTableProfile( promoCodeId: number ) {
    const params = {
      promoCodeId: promoCodeId,
      from: 0,
      count: 10,
      sortvalue: 'last_name'
    };
    this.addPromotionsCodesService.getProfiles( params )
      .pipe( untilDestroyed( this ) )
      .subscribe( ( profilePromoCode: IProfilePromoCode ) => {
        this.tableAsyncService.countPage = profilePromoCode.totalCount;
        this.profilePromoCode = profilePromoCode;
        this.isLoader = false;
      } );
  }

  private windowDialog( messDialog: string, params: string, card: string = '', disableTimer: boolean = false, intersection: any = [] ) {
    this.dialog.open( DialogComponent, {
      data: {
        message: messDialog,
        status: params,
        params: this.promoCodeId,
        card,
        intersection,
      },
    } );
    if ( !disableTimer ) {
      timer( 1500 )
        .pipe( untilDestroyed( this ) )
        .subscribe( _ => {
          this.dialog.closeAll();
        } );
    }
  }

  private formFilling( promoCodeId: number ) {
    this.addPromotionsCodesService.getPromoCode( +promoCodeId )
      .pipe( untilDestroyed( this ) )
      .subscribe( ( promoCod: IPromoCode ) => {
        const { usesFact, usesTotal } = promoCod;
        this.usesFact = usesFact;
        this.usesTotal = usesTotal;
        this.progressBar = this.usesFact  / this.usesTotal * 100;
        _.set( promoCod, 'promotionName', _.get( promoCod, 'promotion.promotionName' ) );
        _.each( promoCod, ( value: any, key: string ) => {
          if ( !_.isNull( value ) && !_.isNaN( value ) ) {
            if ( _.isArray( value ) ) {
              switch ( key ) {
                case 'promoCodeBrandList':
                  this.promoCodeBrandListChips = value;
                  break;
                case 'promoCodeFlightList':
                  this.promoCodeFlightListChips = value;
                  break;
                case 'promoCodeRbdList':
                  this.promoCodeRbdListChips = value;
                  break;
                case 'promoCodeRouteList':
                  this.promoCodeRouteList = value;
                  break;
                case 'customersIds':
                  this.arrCustomerIds = value;
                  this.searchCustomerName( this.arrCustomerIds );
                  break;
                case 'segmentations':
                  this.segmentationChips = _.map( value, 'title' );
                  break;
                case 'customerGroups':
                  this.customerGroupChips = _.map( value, 'customerGroupName' );
                  break;
              }
            } else {
              _.each( this.formPromoCodes.getRawValue(), ( valForm, keyForm ) => {
                if ( keyForm === key ) this.formPromoCodes.get( key ).patchValue( value );
              } );
            }
          }
        } );
      } );
  }

  private initFormPromoCodes() {
    this.formPromoCodes = this.fb.group( {
      promotionName: [ '', [ Validators.required ], promotionValidatorAsync( this.addPromotionsService ) ],
      code: '',
      accountCode: '',
      description: '',
      reason: '',
      dateFrom: '',
      dateTo: '',
      flightDateFrom: '',
      flightDateTo: '',
      promoCodeBrandList: '',
      promoCodeFlightList: '',
      promoCodeRbdList: '',
      dep_Location: null,
      arr_Location: null,
      customersIds: '',
      segmentations: '',
      customerGroups: '',
      usesPerPerson: '',
      usesTotal: '',
      val: '',
      promoCodeValTypeId: '',
    } );
  }

  private resetForm() {
    this.promoCodeBrandListChips = [];
    this.promoCodeFlightListChips = [];
    this.promoCodeRbdListChips = [];
    this.promoCodeCustomerListChips = [];
    this.promoCodeRouteList = [];
    this.segmentationChips = [];
    this.customerGroupChips = [];
    _( this.formPromoCodes.value ).each( ( value, key ) => {
      this.formPromoCodes.get( key ).patchValue( '' );
      this.formPromoCodes.get( key ).setErrors( null );
    } );
    this.buttonSave = false;
    this.buttonCreate = true;
    this.buttonSearch = true;
    this.buttonDelete = true;
    this.buttonCopy = true;
  }


  private initAutocomplete() {
    this.promotionsOptions = this.autocomplete( 'promotionName', 'promotion' );
    this.segmentationOptions = this.autocomplete( 'segmentations', 'segmentations' );
    this.customerGroupOptions = this.autocomplete( 'customerGroups', 'customerGroups' );
  }

  private autocomplete( formControlName: string, options: string ): Observable<any> {
    return this.formPromoCodes.get( formControlName ).valueChanges
      .pipe(
        untilDestroyed( this ),
        debounceTime( this.autDelay ),
        map( val => {
          switch ( options ) {
            case 'promotion':
              if ( val ) return this.promotions.result.filter( promotions => promotions.promotionName.toLowerCase().includes( val.toLowerCase() ) );
              break;
            case 'segmentations':
              if ( val !== null ) return this.segmentation.filter( segmentation => segmentation.title.toLowerCase().includes( val.toLowerCase() ) );
              break;
            case 'customerGroups':
              return this.customerGroup.filter( customerGroup => {
                  if ( val !== null ) return customerGroup.customerGroupName.toLowerCase().includes( val.toLowerCase() );
                }
              );
              break;
          }
        } )
      );
  }

  private searchCustomerName( customerIds ) {
    const isArray = R.is( Array );
    const arrPush = R.curry( ( arr: number[], arrIds: string ) => R.append( +arrIds, arr ) );
    const arrCustomerIdsPush = arrPush( this.arrCustomerIds );
    const uniqWith = ( arrCustomerIds: number[] ) => _.uniqWith( arrCustomerIds, _.isEqual );
    const startSearchCustomer = ( arrCustomerIds: number[] ) => this.searchCustomerName( arrCustomerIds );
    const composeSearchCustomer = R.compose( startSearchCustomer, uniqWith, arrCustomerIdsPush );
    if ( !isArray( customerIds ) ) composeSearchCustomer( customerIds );

    const customerName = result => {
      const { customerId, firstName, lastName } = _.head( result.customerNames );
      return {
        customerId,
        customerName: `${firstName} ${lastName}`
      };
    };
    const mapCustomerName = R.map( customerName );
    const customerResult = customer => customer.result;
    const newCustomerName = result => mapCustomerName( result );
    const success = ( value: IChipsCustomerList[] ) => this.promoCodeCustomerListChips = value;
    const params: any = {
      customerids: customerIds,
      sortvalue: 'last_name',
      from: 0,
      count: 10
    };

    this.profileSearchService.getProfileSearch( params )
      .pipe(
        untilDestroyed( this ),
        map( customerResult ),
        map( newCustomerName )
      )
      .subscribe( success );
  }

  private resetInputChipInput = ( formControlName: string, ): void => this.formPromoCodes.get( formControlName ).setValue( null );

  add( event: MatChipInputEvent, formControlName: string, chips: string ): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ( ( value || '' ).trim() ) {
      if ( chips === 'promoCodeCustomerListChips' ) {
        this.searchCustomerName( value.trim() );
        this.resetInputChipInput( formControlName );
      }

      if (
        formControlName === 'promoCodeFlightList'
        && _.size( value ) >= 3
        && this.promoCodeFlightListRegexp.test( value )
      ) {
        this[ chips ].push( value.trim().toUpperCase() );
        this.resetInputChipInput( formControlName );
      }
    }

  }

  remove( textChip: string, arrayChips: string[], chips ): void {
    const index = arrayChips.indexOf( textChip );

    if ( index >= 0 ) {
      this[ chips ].splice( index, 1 );
    }
  }

  selected( event: MatAutocompleteSelectedEvent, formControlName: string, chips: string, fruitInput: string ): void {
    this[ chips ].push( event.option.viewValue );
    this[ fruitInput ].nativeElement.value = '';
    this.formPromoCodes.get( formControlName ).setValue( null );
  }

  directionAdd(): void {
    if ( this.formPromoCodes.get( 'dep_Location' ).value || this.formPromoCodes.get( 'arr_Location' ).value ) {
      this.promoCodeRouteList.push(
        {
          dep_Location: this.formPromoCodes.get( 'dep_Location' ).value,
          arr_Location: this.formPromoCodes.get( 'arr_Location' ).value
        }
      );
    }
    this.promoCodeRouteList = _.unionWith( this.promoCodeRouteList, _.isEqual );
    this.formPromoCodes.get( 'dep_Location' ).patchValue( null );
    this.formPromoCodes.get( 'arr_Location' ).patchValue( null );
  }

  directionRemove( dep: string, arr: string ): void {
    const obj: any = { 'dep_Location': dep, 'arr_Location': arr };
    this.promoCodeRouteList = _.reject( this.promoCodeRouteList, obj );
  }

  private promoCodeParameters() {
    const segmentation = [];
    const customerGroup = [];

    _.each( this.segmentationChips, segmentationChip => {
      segmentation.push( _.chain( this.segmentation ).find( { 'title': segmentationChip } ).get( 'segmentationId' ).value() );
    } );

    _.each( this.customerGroupChips, customerGroupChip => {
      customerGroup.push( _.chain( this.customerGroup ).find( { 'customerGroupName': customerGroupChip } ).get( 'customerGroupId' ).value() );
    } );

    const mapCustomer = R.map( ( customer: IChipsCustomerList ) => customer.customerId );

    const params = {
      PromotionId: _.chain( this.promotions.result )
        .find( [ 'promotionName', this.formPromoCodes.get( 'promotionName' ).value ] )
        .get( 'promotionId' )
        .value(),
      code: this.formPromoCodes.get( 'code' ).value,
      accountCode: this.formPromoCodes.get( 'accountCode' ).value,
      description: this.formPromoCodes.get( 'description' ).value,
      reason: this.formPromoCodes.get( 'reason' ).value,
      dateFrom: this.formPromoCodes.get( 'dateFrom' ).value ?
        moment( this.formPromoCodes.get( 'dateFrom' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '',
      dateTo: this.formPromoCodes.get( 'dateTo' ).value ?
        moment( this.formPromoCodes.get( 'dateTo' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '',
      flightDateFrom: this.formPromoCodes.get( 'flightDateFrom' ).value ?
        moment( this.formPromoCodes.get( 'flightDateFrom' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '',
      flightDateTo: this.formPromoCodes.get( 'flightDateTo' ).value ?
        moment( this.formPromoCodes.get( 'flightDateTo' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '',
      usesPerPerson: this.formPromoCodes.get( 'usesPerPerson' ).value,
      usesTotal: this.formPromoCodes.get( 'usesTotal' ).value,
      val: this.formPromoCodes.get( 'val' ).value,
      promoCodeValTypeId: this.formPromoCodes.get( 'promoCodeValTypeId' ).value,
      promoCodeBrandList: this.promoCodeBrandListChips,
      promoCodeFlightList: this.promoCodeFlightListChips,
      promoCodeRbdList: this.promoCodeRbdListChips,
      customersIds: mapCustomer( this.promoCodeCustomerListChips ),
      segmentationsIds: segmentation,
      customerGroupsIds: customerGroup,
      promoCodeRouteList: this.promoCodeRouteList,
    };

    return params;
  }


  private isPromoCod( messDialog ) {
    return ( promoCodeAdd: IPromoCodesAdd ) => {
      this.windowDialog( messDialog, 'ok' );
      this.router.navigate( [ '/crm/add-promotions-codes' ], { queryParams: { promoCodeId: promoCodeAdd.promoCode.promoCodeId } } );
    };
  }

  private isIntersectionPromoCod() {
    return ( promoCodeAdd: IPromoCodesAdd ) => {
      this.windowDialog( '', 'intersection', 'intersection', true, promoCodeAdd.intersectingPromoCodes );
    };
  }

  private intersectionPromoCod( promoCodeAdd: IPromoCodesAdd, messDialog ) {
    const isNil = () => R.isNil( promoCodeAdd.promoCode );
    const whichMethod = R.ifElse( isNil, this.isIntersectionPromoCod(), this.isPromoCod( messDialog ) );
    whichMethod( promoCodeAdd );
  }

  saveForm( queryParams: any = '' ): void {
    const hasSaveFormParams = R.has( 'saveFormParams' );
    const isQueryParams = hasSaveFormParams( queryParams );
    const saveFormParams = isQueryParams ? JSON.parse( queryParams.saveFormParams ) : '';
    if ( !this.formPromoCodes.invalid || isQueryParams ) {
      this.addPromotionsCodesService.savePromoCode( isQueryParams ? saveFormParams : this.promoCodeParameters() )
        .pipe( untilDestroyed( this ) )
        .subscribe( ( promoCodeAdd: IPromoCodesAdd ) => this.intersectionPromoCod( promoCodeAdd, 'DIALOG.OK.PROMO_CODE_SAVE' ) );
    }
  }

  searchForm(): void {
    const isEmptyInput = () => R.isEmpty( this.promoCodeCustomerListChips ) && R.isEmpty( this.segmentationChips ) && R.isEmpty( this.customerGroupChips );
    const startSearch = () => {
      this.isTable = true;
      this.isLoader = true;
      this.initTableProfile( this.promoCodeId );
    };
    const stopSearch = () => this.windowDialog( 'DIALOG.OK.PROMO_CODE_NOT_PERSONALIZED', 'ok', '_', true );
    const search = R.ifElse( isEmptyInput, stopSearch, startSearch );

    search( R.identity );
  }

  createForm(): void {
    if ( !this.formPromoCodes.invalid ) {
      const params = this.promoCodeParameters();
      _.set( params, 'promoCodeId', this.promoCodeId );
      this.addPromotionsCodesService.updatePromoCode( params )
        .pipe( untilDestroyed( this ) )
        .subscribe( ( promoCodeAdd: IPromoCodesAdd ) => this.intersectionPromoCod( promoCodeAdd, 'DIALOG.OK.PROMO_CODE_CHANGED' ) );
    }
  }

  copyForm(): void {
    this.router.navigate( [ '/crm/add-promotions-codes' ], { queryParams: {} } );
    this.buttonSave = false;
    this.buttonCopy = true;
    this.buttonCreate = true;
    this.buttonDelete = true;
    this.buttonSearch = true;
  }

  clearForm(): void {
    this.resetForm();
    this.router.navigate( [ '/crm/add-promotions-codes' ], { queryParams: {} } );
  }

  deletePromoCode(): void {
    this.windowDialog( `DIALOG.DELETE.PROMO_CODE`, 'delete', 'promoCode', true );
  }

  ngOnDestroy(): void {}

}
