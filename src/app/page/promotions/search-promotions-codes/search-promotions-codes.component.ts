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
import { IPromoCode } from '../../../interface/ipromo-code';
import * as moment from 'moment';

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
  public promoCodesOptions: Observable<IPromoCode>;
  public promotions: IPromotions;
  public promoCodes: IPromoCode;
  public segmentation: ISegmentation[];
  public customerGroup: IcustomerGroup[];
  public promoCode: IPromoCode;
  public buttonSearch: boolean;

  private isActive: boolean;
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
    private tableAsyncService: TableAsyncService,
  ) { }

  ngOnInit() {
    this.isActive = true;
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
      .pipe( takeWhile( _ => this.isActive ) )
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
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( promotions: IPromotions ) => this.promotions = promotions );
  }

  private initPromoCodes() {
    const params = {
      from: 0,
      count: 10000
    };
    this.addPromotionsCodesService.getAllPromoCodes( params )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( promoCodes: IPromoCode ) => this.promoCodes = promoCodes );
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

  private activeButton() {
    const isValueNullOrUnd = value => _.isNull( value ) || _.isUndefined( value );
    const isFormInvalid = _.curry( ( objForm, value ) => isValueNullOrUnd( value ) || objForm.invalid );
    const isFormValOfInv = isFormInvalid( this.formSearchPromoCodes );
    const mapKeyFormObj = _.curry( ( objForm, objFormValue ) => _.mapKeys( objFormValue, ( value, key ) => objForm.get( `${key}` ).value === '' || isFormValOfInv( objForm.get( `${key}` ).value ) ) );
    const getBooleanObj = mapKeyFormObj( this.formSearchPromoCodes );
    const isSizeObj = objFormValue => _.size( objFormValue ) === 1;
    const isActiveButtonSearch = _.flow( [ getBooleanObj, isSizeObj ] );

    this.formSearchPromoCodes.valueChanges
      .pipe(
        takeWhile( _ => this.isActive ),
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
      'dateFrom_From',
      'dateFrom_To',
      'dateTo_From',
      'dateTo_To',
      'flightDateFrom_From',
      'flightDateFrom_To',
      'flightDateTo_From',
      'flightDateTo_To',
    ] );

    const getSegmentationName = _.chain( this.segmentation ).find( [ 'segmentationId', +params.segmentationId ] ).get( 'title' ).value();
    const getCustomerGroupName = _.chain( this.customerGroup ).find( [ 'customerGroupId', +params.customerGroupId ] ).get( 'customerGroupName' ).value();

    _.chain( formParams )
      .set( 'segmentationId', getSegmentationName ? getSegmentationName : '' )
      .set( 'customerGroupId', getCustomerGroupName ? getCustomerGroupName : '' )
      .set( 'dateFrom', params.dateFrom_From ? new Date( params.dateFrom_From.split( '.' ).reverse().join( ',' ) ) : '' )
      .set( 'dateTo', params.dateTo_From ? new Date( params.dateTo_From.split( '.' ).reverse().join( ',' ) ) : '' )
      .set( 'flightDateFrom', params.dateTo_From ? new Date( params.flightDateFrom_From.split( '.' ).reverse().join( ',' ) ) : '' )
      .set( 'flightDateTo', params.flightDateTo_From ? new Date( params.flightDateTo_From.split( '.' ).reverse().join( ',' ) ) : '' )
      .value();

    if ( !!params.segmentationId || !!params.customerGroupId ) {
      this.listSegmentationService.getSegmentation()
        .pipe(
          takeWhile( _ => this.isActive ),
          takeWhile( _ => !!params.segmentationId ),
          map( ( segmentation: ISegmentation[] ) => _.set( formParams, 'segmentationId', _.chain( segmentation ).find( [ 'segmentationId', +params.segmentationId ] ).get( 'title' ).value() ) )
        )
        .subscribe( formParamsSegmentation => this.formSearchPromoCodes.patchValue( formParamsSegmentation ) );

      this.profileGroupService.getProfileGroup()
        .pipe(
          takeWhile( _ => this.isActive ),
          takeWhile( _ => !!params.customerGroupId ),
          map( ( customerGroup: IcustomerGroup[] ) => _.set( formParams, 'customerGroupId', _.chain( customerGroup ).find( [ 'customerGroupId', +params.customerGroupId ] ).get( 'customerGroupName' ).value() ) )
        )
        .subscribe( formParamsCustomerGroup => this.formSearchPromoCodes.patchValue( formParamsCustomerGroup ) );

      timer( 1000 )
        .pipe(
          takeWhile( _ => this.isActive ),
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
        takeWhile( _ => this.isActive ),
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
    this.tableAsyncService.subjectPage
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;

        this.searchParams = _.chain( this.searchParams )
          .set( 'from', pageIndex )
          .set( 'count', value.pageSize )
          .value();

        this.searchPromotionsCodesService.getSearchPromotionsCodes( this.searchParams )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( ( promoCode: IPromoCode ) => this.tableAsyncService.setTableDataSource( promoCode.result ) );
      } );
  }


  searchForm(): void {
    if ( !this.formSearchPromoCodes.invalid ) {
      this.isTable = true;
      this.isLoader = true;
      this.isQueryParams = false;
      this.searchParams = _.omit( this.formSearchPromoCodes.getRawValue(), [ 'dateFrom', 'dateTo', 'flightDateFrom', 'flightDateTo', 'segmentationId', 'customerGroupId' ] );

      _.chain( this.searchParams )
        .set( 'dateFrom_From', this.formSearchPromoCodes.get( 'dateFrom' ).value ? moment( this.formSearchPromoCodes.get( 'dateFrom' ).value ).format( 'DD.MM.YYYY' ) : '' )
        .set( 'dateFrom_To', this.formSearchPromoCodes.get( 'dateFrom' ).value ? moment( this.formSearchPromoCodes.get( 'dateFrom' ).value ).format( 'DD.MM.YYYY' ) : '' )
        .set( 'dateTo_From', this.formSearchPromoCodes.get( 'dateTo' ).value ? moment( this.formSearchPromoCodes.get( 'dateTo' ).value ).format( 'DD.MM.YYYY' ) : '' )
        .set( 'dateTo_To', this.formSearchPromoCodes.get( 'dateTo' ).value ? moment( this.formSearchPromoCodes.get( 'dateTo' ).value ).format( 'DD.MM.YYYY' ) : '' )
        .set( 'flightDateFrom_From', this.formSearchPromoCodes.get( 'flightDateFrom' ).value ? moment( this.formSearchPromoCodes.get( 'flightDateFrom' ).value ).format( 'DD.MM.YYYY' ) : '' )
        .set( 'flightDateFrom_To', this.formSearchPromoCodes.get( 'flightDateFrom' ).value ? moment( this.formSearchPromoCodes.get( 'flightDateFrom' ).value ).format( 'DD.MM.YYYY' ) : '' )
        .set( 'flightDateTo_From', this.formSearchPromoCodes.get( 'flightDateTo' ).value ? moment( this.formSearchPromoCodes.get( 'flightDateTo' ).value ).format( 'DD.MM.YYYY' ) : '' )
        .set( 'flightDateTo_To', this.formSearchPromoCodes.get( 'flightDateTo' ).value ? moment( this.formSearchPromoCodes.get( 'flightDateTo' ).value ).format( 'DD.MM.YYYY' ) : '' )
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
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( ( promoCode: IPromoCode ) => {
          this.tableAsyncService.countPage = promoCode.totalCount;
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

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
