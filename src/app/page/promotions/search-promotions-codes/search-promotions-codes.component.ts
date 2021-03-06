import { Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchPromotionsCodesService } from './search-promotions-codes.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TableAsyncService } from '../../../services/table-async.service';
import { delay, map, takeWhile } from 'rxjs/operators';
import { IpagPage } from '../../../interface/ipag-page';
import { Observable, timer } from 'rxjs';
import { IPromotions } from '../../../interface/ipromotions';
import { AddPromotionsService } from '../add-promotions/add-promotions.service';
import { ISegmentation } from '../../../interface/isegmentation';
import { ListSegmentationService } from '../../segmentation/list-segmentation/list-segmentation.service';
import { ProfileGroupService } from '../../special-groups/profile-group/profile-group.service';
import { IcustomerGroup } from '../../../interface/icustomer-group';
import { AddPromotionsCodesService } from '../add-promotions-codes/add-promotions-codes.service';
import { IPromoCodes } from '../../../interface/ipromo-code';
import * as moment from 'moment';
import * as R from 'ramda';
import { TableAsyncSearchPromoCodeService } from '../../../components/tables/table-async-search-promo-code/table-async-search-promo-code.service';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component( {
  selector: 'app-search-promotions-codes',
  templateUrl: './search-promotions-codes.component.html',
  styleUrls: [ './search-promotions-codes.component.styl' ]
} )
export class SearchPromotionsCodesComponent implements OnInit, OnDestroy {

  public isTable: boolean;
  public isLoader: boolean;
  public isQueryParams: boolean;
  public formSearchPromoCodes: FormGroup;
  public promotionsOptions: Observable<IPromotions[]>;
  public segmentationOptions: Observable<ISegmentation[]>;
  public customerGroupOptions: Observable<IcustomerGroup[]>;
  public promoCodesOptions: Observable<IPromoCodes>;
  public promotions: IPromotions;
  public promoCodes: IPromoCodes;
  public segmentation: ISegmentation[];
  public customerGroup: IcustomerGroup[];
  public promoCode: IPromoCodes;
  public buttonSearch: boolean;


  private autDelay: number;
  private searchParams: any;

  constructor(
    private searchPromotionsCodesService: SearchPromotionsCodesService,
    private addPromotionsService: AddPromotionsService,
    private addPromotionsCodesService: AddPromotionsCodesService,
    private listSegmentationService: ListSegmentationService,
    private profileGroupService: ProfileGroupService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tableAsyncSearchPromoCodeService: TableAsyncSearchPromoCodeService,
  ) { }

  ngOnInit() {

    this.isLoader = true;
    this.isQueryParams = true;
    this.buttonSearch = true;
    this.autDelay = 500;
    this.initFormSearchPromoCodes();
    this.initPromotions();
    this.initPromoCodes();
    this.initSegmentation();
    this.initCustomerGroup();
    this.initAutocomplete();
    this.initTableProfilePagination();
    this.initQueryParams();
    this.activeButton();
  }

  private initQueryParams() {
    this.route.queryParams
      .pipe( untilDestroyed(this) )
      .subscribe( params => {
        if ( _.size( params ) > 0 ) {
          this.formFilling( params );
        }
      } );
  }

  private initPromotions() {
    const params = {
      from: 0,
      count: 10000
    };
    this.addPromotionsService.getAllPromotions( params )
      .pipe( untilDestroyed(this) )
      .subscribe( ( promotions: IPromotions ) => this.promotions = promotions );
  }

  private initPromoCodes() {
    const params = {
      from: 0,
      count: 10000
    };
    this.addPromotionsCodesService.getAllPromoCodes( params )
      .pipe( untilDestroyed(this) )
      .subscribe( ( promoCodes: IPromoCodes ) => this.promoCodes = promoCodes );
  }

  private initSegmentation() {
    this.listSegmentationService.getSegmentation()
      .pipe( untilDestroyed(this) )
      .subscribe( ( segmentation: ISegmentation[] ) => {
        this.segmentation = segmentation;
      } );
  }

  private initCustomerGroup() {
    this.profileGroupService.getProfileGroup()
      .pipe( untilDestroyed(this) )
      .subscribe( ( customerGroup: IcustomerGroup[] ) => {
        this.customerGroup = customerGroup;
      } );
  }

  private activeButton() {
    const isFormInvalid = R.curry( ( objForm: any, value ) => R.isNil( value ) || objForm.invalid );
    const isFormValOfInv = isFormInvalid( this.formSearchPromoCodes );
    const funcMapKeys = R.curry( ( objForm, value, key ) => objForm.get( `${key}` ).value === '' || isFormValOfInv( objForm.get( `${key}` ).value ) );
    const mapKeyFormObj = R.curry( ( objForm: any, objFormValue ) => _.mapKeys( objFormValue, funcMapKeys( objForm ) ) );
    const getBooleanObj = mapKeyFormObj( this.formSearchPromoCodes );
    const isSizeObj = objFormValue => _.size( objFormValue ) === 1;
    const isActiveButtonSearch = R.compose( isSizeObj, getBooleanObj );

    this.formSearchPromoCodes.valueChanges
      .pipe(
        untilDestroyed(this),
        map( () => isActiveButtonSearch( this.formSearchPromoCodes.value ) )
      )
      .subscribe( isValue => this.buttonSearch = isValue );
  }


  private formFilling( params ) {
    const formParams = _.omit( params, [
      'from',
      'count',
      'segmentationId',
      'customerGroupId',
      'dateFrom',
      'dateTo',
      'flightDateFrom',
      'flightDateTo',
    ] );

    const getSegmentationName = _.chain( this.segmentation ).find( [ 'segmentationId', +params.segmentationId ] ).get( 'title' ).value();
    const getCustomerGroupName = _.chain( this.customerGroup ).find( [ 'customerGroupId', +params.customerGroupId ] ).get( 'customerGroupName' ).value();

    _.chain( formParams )
      .set( 'segmentationId', getSegmentationName ? getSegmentationName : '' )
      .set( 'customerGroupId', getCustomerGroupName ? getCustomerGroupName : '' )
      .set( 'dateFrom', params.dateFrom ? new Date( params.dateFrom.split( '.' ).reverse().join( ',' ) ) : '' )
      .set( 'dateTo', params.dateTo ? new Date( params.dateTo.split( '.' ).reverse().join( ',' ) ) : '' )
      .set( 'flightDateFrom', params.flightDateFrom ? new Date( params.flightDateFrom.split( '.' ).reverse().join( ',' ) ) : '' )
      .set( 'flightDateTo', params.flightDateTo ? new Date( params.flightDateTo.split( '.' ).reverse().join( ',' ) ) : '' )
      .value();

    if ( !!params.segmentationId || !!params.customerGroupId ) {
      this.listSegmentationService.getSegmentation()
        .pipe(
          untilDestroyed(this),
          takeWhile( _ => !!params.segmentationId ),
          map( ( segmentation: ISegmentation[] ) => _.set( formParams, 'segmentationId', _.chain( segmentation ).find( [ 'segmentationId', +params.segmentationId ] ).get( 'title' ).value() ) )
        )
        .subscribe( formParamsSegmentation => this.formSearchPromoCodes.patchValue( formParamsSegmentation ) );

      this.profileGroupService.getProfileGroup()
        .pipe(
          untilDestroyed(this),
          takeWhile( _ => !!params.customerGroupId ),
          map( ( customerGroup: IcustomerGroup[] ) => _.set( formParams, 'customerGroupId', _.chain( customerGroup ).find( [ 'customerGroupId', +params.customerGroupId ] ).get( 'customerGroupName' ).value() ) )
        )
        .subscribe( formParamsCustomerGroup => this.formSearchPromoCodes.patchValue( formParamsCustomerGroup ) );

      timer( 1000 )
        .pipe(
          untilDestroyed(this),
          takeWhile( _ => this.isQueryParams )
        )
        .subscribe( _ => this.searchForm() );

      this.isTable = true;
      this.isLoader = true;

    } else {
      this.formSearchPromoCodes.patchValue( formParams );
      if ( this.isQueryParams ) this.searchForm();
    }
  }

  private initFormSearchPromoCodes() {
    this.formSearchPromoCodes = this.fb.group( {
      promotionName: '',
      code: '',
      accountCode: '',
      reason: '',
      dateFrom: '',
      dateTo: '',
      flightDateFrom: '',
      flightDateTo: '',
      promoCodeBrand: '',
      promoCodeFlight: '',
      promoCodeRbd: '',
      segmentationId: '',
      customerGroupId: '',
      val: ''
    } );
    this.activeButton();
  }

  private resetForm() {
    _( this.formSearchPromoCodes.value ).each( ( value, key ) => {
      this.formSearchPromoCodes.get( key ).patchValue( '' );
      this.formSearchPromoCodes.get( key ).setErrors( null );
    } );
  }


  private initAutocomplete() {
    this.promotionsOptions = this.autocomplete( 'promotionName', 'promotion' );
    this.segmentationOptions = this.autocomplete( 'segmentationId', 'segmentationId' );
    this.customerGroupOptions = this.autocomplete( 'customerGroupId', 'customerGroupId' );
    this.promoCodesOptions = this.autocomplete( 'code', 'promoCode' );
  }

  private autocomplete( formControlName: string, options: string ): Observable<any> {
    return this.formSearchPromoCodes.get( formControlName ).valueChanges
      .pipe(
        untilDestroyed(this),
        delay( this.autDelay ),
        map( val => {
          switch ( options ) {
            case 'promotion':
              if ( val ) return this.promotions.result.filter( promotions => promotions.promotionName.toLowerCase().includes( val.toLowerCase() ) );
              break;
            case 'segmentationId':
              if ( val ) return this.segmentation.filter( segmentation => segmentation.title.toLowerCase().includes( val.toLowerCase() ) );
              break;
            case 'customerGroupId':
              return this.customerGroup.filter( customerGroup => {
                  if ( val ) return customerGroup.customerGroupName.toLowerCase().includes( val.toLowerCase() );
                }
              );
              break;
            case 'promoCode':
              if ( _.size( val ) >= 3 ) return this.promoCodes.result.filter( promoCodes => promoCodes.code.toLowerCase().includes( val.toLowerCase() ) );
              break;
          }
        } )
      );
  }

  private initTableProfilePagination() {
    this.tableAsyncSearchPromoCodeService.subjectPage
      .pipe( untilDestroyed(this) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;

        this.searchParams = _.chain( this.searchParams )
          .set( 'from', pageIndex )
          .set( 'count', value.pageSize )
          .value();

        this.searchPromotionsCodesService.getSearchPromotionsCodes( this.searchParams )
          .pipe( untilDestroyed(this) )
          .subscribe( ( promoCode: IPromoCodes ) => this.tableAsyncSearchPromoCodeService.setTableDataSource( promoCode.result ) );
      } );
  }


  searchForm(): void {
    if ( !this.formSearchPromoCodes.invalid ) {
      this.isTable = true;
      this.isLoader = true;
      this.isQueryParams = false;
      this.searchParams = _.omit( this.formSearchPromoCodes.getRawValue(), [ 'dateFrom', 'dateTo', 'flightDateFrom', 'flightDateTo', 'segmentationId', 'customerGroupId' ] );

      _.chain( this.searchParams )
        .set( 'dateFrom', this.formSearchPromoCodes.get( 'dateFrom' ).value ? moment( this.formSearchPromoCodes.get( 'dateFrom' ).value ).format( 'DD.MM.YYYY' ) : '' )
        .set( 'dateTo', this.formSearchPromoCodes.get( 'dateTo' ).value ? moment( this.formSearchPromoCodes.get( 'dateTo' ).value ).format( 'DD.MM.YYYY' ) : '' )
        .set( 'flightDateFrom', this.formSearchPromoCodes.get( 'flightDateFrom' ).value ? moment( this.formSearchPromoCodes.get( 'flightDateFrom' ).value ).format( 'DD.MM.YYYY' ) : '' )
        .set( 'flightDateTo', this.formSearchPromoCodes.get( 'flightDateTo' ).value ? moment( this.formSearchPromoCodes.get( 'flightDateTo' ).value ).format( 'DD.MM.YYYY' ) : '' )
        .set( 'segmentationId', this.formSearchPromoCodes.get( 'segmentationId' ).value ? _.chain( this.segmentation ).find( [ 'title', this.formSearchPromoCodes.get( 'segmentationId' ).value ] ).get( 'segmentationId' ).value() : '' )
        .set( 'customerGroupId', this.formSearchPromoCodes.get( 'customerGroupId' ).value ? _.chain( this.customerGroup ).find( [ 'customerGroupName', this.formSearchPromoCodes.get( 'customerGroupId' ).value ] ).get( 'customerGroupId' ).value() : '' )
        .set( 'from', 0 )
        .set( 'count', 10 )
        .value();

      const paramsOmit = [];
      _.each( this.searchParams, ( val, key ) => {
        if ( val === '' ) paramsOmit.push( key );
      } );
      this.searchParams = _.omit( this.searchParams, paramsOmit );
      this.searchPromotionsCodesService.getSearchPromotionsCodes( this.searchParams )
        .pipe( untilDestroyed(this) )
        .subscribe( ( promoCode: IPromoCodes ) => {
          this.tableAsyncSearchPromoCodeService.countPage = promoCode.totalCount;
          this.promoCode = promoCode;
          this.isLoader = false;
        } );
      this.isQueryParams = false;
      this.router.navigate( [ '/crm/search-promotions-codes' ], { queryParams: this.searchParams } );
    }
  }

  clearForm(): void {
    this.resetForm();
    this.router.navigate( [ '/crm/search-promotions-codes' ], { queryParams: {} } );
  }

  ngOnDestroy(): void {}

}
