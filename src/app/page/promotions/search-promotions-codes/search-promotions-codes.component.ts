import { Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchPromotionsCodesService } from './search-promotions-codes.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TableAsyncService } from '../../../services/table-async.service';
import { delay, map, takeWhile } from 'rxjs/operators';
import { IpagPage } from '../../../interface/ipag-page';
import { IProfilePromoCode } from '../../../interface/iprofile-promo-code';
import { Observable } from 'rxjs';
import { IPromotions } from '../../../interface/ipromotions';
import { AddPromotionsService } from '../add-promotions/add-promotions.service';
import { ISegmentation } from '../../../interface/isegmentation';
import { ListSegmentationService } from '../../segmentation/list-segmentation/list-segmentation.service';
import { ProfileGroupService } from '../../special-groups/profile-group/profile-group.service';
import { IcustomerGroup } from '../../../interface/icustomer-group';
import { AddPromotionsCodesService } from '../add-promotions-codes/add-promotions-codes.service';
import { IPromoCode } from '../../../interface/ipromo-code';

@Component( {
  selector: 'app-search-promotions-codes',
  templateUrl: './search-promotions-codes.component.html',
  styleUrls: [ './search-promotions-codes.component.styl' ]
} )
export class SearchPromotionsCodesComponent implements OnInit, OnDestroy {

  public isTable: boolean;
  public isLoader: boolean;
  public formSearchPromoCodes: FormGroup;
  public promotionsOptions: Observable<IPromotions[]>;
  public segmentationOptions: Observable<ISegmentation[]>;
  public customerGroupOptions: Observable<IcustomerGroup[]>;
  public promoCodesOptions: Observable<IPromoCode>;
  public promotions: IPromotions;
  public promoCodes: IPromoCode;
  public segmentation: ISegmentation[];
  public customerGroup: IcustomerGroup[];

  private isActive: boolean;
  private autDelay: number;

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
    this.autDelay = 500;
    this.initFormSearchPromoCodes();
    this.initPromotions();
    this.initPromoCodes();
    this.initSegmentation();
    this.initCustomerGroup();
    this.initAutocomplete();
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
              if ( val !== null ) return this.segmentation.filter( segmentation => segmentation.title.toLowerCase().includes( val.toLowerCase() ) );
              break;
            case 'customerGroupId':
              return this.customerGroup.filter( customerGroup => {
                  if ( val !== null ) return customerGroup.customerGroupName.toLowerCase().includes( val.toLowerCase() );
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

  // private initTableProfilePagination() {
  //   this.tableAsyncService.subjectPage
  //     .pipe( takeWhile( _ => this.isActive ) )
  //     .subscribe( ( value: IpagPage ) => {
  //       const pageIndex = value.pageIndex * value.pageSize;
  //       const paramsAndCount = {
  //         code: this.code,
  //         from: pageIndex,
  //         count: value.pageSize,
  //         sortvalue: 'last_name'
  //       };
  //       this.addPromotionsCodesService.getProfiles( paramsAndCount )
  //         .pipe( takeWhile( _ => this.isActive ) )
  //         .subscribe( ( profilePromoCode: IProfilePromoCode ) => this.tableAsyncService.setTableDataSource( profilePromoCode.result ) );
  //     } );
  // }
  //
  // private initTableProfile( id: number ) {
  //   const params = {
  //     code: id,
  //     from: 0,
  //     count: 10,
  //     sortvalue: 'last_name'
  //   };
  //   this.addPromotionsCodesService.getProfiles( params )
  //     .pipe( takeWhile( _ => this.isActive ) )
  //     .subscribe( ( profilePromoCode: IProfilePromoCode ) => {
  //       this.tableAsyncService.countPage = profilePromoCode.totalCount;
  //       this.profilePromoCode = profilePromoCode;
  //       this.isLoader = false;
  //     } );
  // }


  searchForm(): void {
    console.log( this.formSearchPromoCodes.getRawValue() );
    let params = _.omit( this.formSearchPromoCodes.getRawValue(), [ 'dateFrom', 'dateTo', 'flightDateFrom', 'flightDateTo', 'segmentationId', 'customerGroupId' ] );
    _.chain( params )
      .set( 'dateFrom_From', this.formSearchPromoCodes.get( 'dateFrom' ).value ? this.formSearchPromoCodes.get( 'dateFrom' ).value.format( 'DD.MM.YYYY' ) : '' )
      .set( 'dateFrom_To', this.formSearchPromoCodes.get( 'dateFrom' ).value ? this.formSearchPromoCodes.get( 'dateFrom' ).value.format( 'DD.MM.YYYY' ) : '' )
      .set( 'dateTo_From', this.formSearchPromoCodes.get( 'dateTo' ).value ? this.formSearchPromoCodes.get( 'dateTo' ).value.format( 'DD.MM.YYYY' ) : '' )
      .set( 'dateTo_To', this.formSearchPromoCodes.get( 'dateTo' ).value ? this.formSearchPromoCodes.get( 'dateTo' ).value.format( 'DD.MM.YYYY' ) : '' )
      .set( 'flightDateFrom_From', this.formSearchPromoCodes.get( 'flightDateFrom' ).value ? this.formSearchPromoCodes.get( 'flightDateFrom' ).value.format( 'DD.MM.YYYY' ) : '' )
      .set( 'flightDateFrom_To', this.formSearchPromoCodes.get( 'flightDateFrom' ).value ? this.formSearchPromoCodes.get( 'flightDateFrom' ).value.format( 'DD.MM.YYYY' ) : '' )
      .set( 'flightDateTo_From', this.formSearchPromoCodes.get( 'flightDateTo' ).value ? this.formSearchPromoCodes.get( 'flightDateTo' ).value.format( 'DD.MM.YYYY' ) : '' )
      .set( 'flightDateTo_To', this.formSearchPromoCodes.get( 'flightDateTo' ).value ? this.formSearchPromoCodes.get( 'flightDateTo' ).value.format( 'DD.MM.YYYY' ) : '' )
      .set( 'segmentationId', this.formSearchPromoCodes.get( 'segmentationId' ).value ? _.chain( this.segmentation ).find( 'title', this.formSearchPromoCodes.get( 'segmentationId' ).value ).get( 'segmentationId' ).value() : '' )
      .set( 'customerGroupId', this.formSearchPromoCodes.get( 'customerGroupId' ).value ? _.chain( this.customerGroup ).find( 'customerGroupName', this.formSearchPromoCodes.get( 'customerGroupId' ).value ).get( 'customerGroupId' ).value() : '' )
      .set( 'from', 0 )
      .set( 'count', 10 )
      .value();

    const paramsOmit = [];
    _.each( params, ( val, key ) => {
      if ( val === '' ) paramsOmit.push( key );
    } );
    params = _.omit( params, paramsOmit );
    console.log( paramsOmit );
    console.log( params );

    this.searchPromotionsCodesService.getSearchPromotionsCodes( params )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( promoCodes => console.log( promoCodes ) );

    this.router.navigate( [ '/crm/search-promotions-codes' ], { queryParams: params } );
  }

  clearForm(): void {
    this.resetForm();
    this.router.navigate( [ '/crm/search-promotions-codes' ], { queryParams: {} } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
