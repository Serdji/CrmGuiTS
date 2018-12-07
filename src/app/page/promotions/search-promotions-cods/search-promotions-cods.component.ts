import { Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchPromotionsCodsService } from './search-promotions-cods.service';
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

@Component( {
  selector: 'app-search-promotions-cods',
  templateUrl: './search-promotions-cods.component.html',
  styleUrls: [ './search-promotions-cods.component.styl' ]
} )
export class SearchPromotionsCodsComponent implements OnInit, OnDestroy {

  public isTable: boolean;
  public isLoader: boolean;
  public formSearchPromoCods: FormGroup;
  public promotionsOptions: Observable<IPromotions[]>;
  public segmentationOptions: Observable<ISegmentation[]>;
  public customerGroupOptions: Observable<ISegmentation[]>;
  public promotions: IPromotions;
  public segmentation: ISegmentation[];
  public customerGroup: IcustomerGroup[];

  private isActive: boolean;
  private autDelay: number;

  constructor(
    private searchPromotionsCodsService: SearchPromotionsCodsService,
    private addPromotionsService: AddPromotionsService,
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
    this.initFormSearchPromoCods();
    this.initPromotions();
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


  private initFormSearchPromoCods() {
    this.formSearchPromoCods = this.fb.group( {
      promotionName: '',
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
      customersId: '',
      segmentation: '',
      customerGroup: '',
      val: ''
    } );
  }

  private resetForm() {
    _( this.formSearchPromoCods.value ).each( ( value, key ) => {
      this.formSearchPromoCods.get( key ).patchValue( '' );
      this.formSearchPromoCods.get( key ).setErrors( null );
    } );
  }


  private initAutocomplete() {
    this.promotionsOptions = this.autocomplete( 'promotionName', 'promotion' );
    this.segmentationOptions = this.autocomplete( 'segmentation', 'segmentation' );
    this.customerGroupOptions = this.autocomplete( 'customerGroup', 'customerGroup' );
  }

  private autocomplete( formControlName: string, options: string ): Observable<any> {
    return this.formSearchPromoCods.get( formControlName ).valueChanges
      .pipe(
        takeWhile( _ => this.isActive ),
        delay( this.autDelay ),
        map( val => {
          switch ( options ) {
            case 'promotion':
              if ( val ) return this.promotions.result.filter( promotions => promotions.promotionName.toLowerCase().includes( val.toLowerCase() ) );
              break;
            case 'segmentation':
              if ( val !== null ) return this.segmentation.filter( segmentation => segmentation.title.toLowerCase().includes( val.toLowerCase() ) );
              break;
            case 'customerGroup':
              return this.customerGroup.filter( customerGroup => {
                  if ( val !== null ) return customerGroup.customerGroupName.toLowerCase().includes( val.toLowerCase() );
                }
              );
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
  //         promoCodeId: this.promoCodeId,
  //         from: pageIndex,
  //         count: value.pageSize,
  //         sortvalue: 'last_name'
  //       };
  //       this.addPromotionsCodsService.getProfiles( paramsAndCount )
  //         .pipe( takeWhile( _ => this.isActive ) )
  //         .subscribe( ( profilePromoCode: IProfilePromoCode ) => this.tableAsyncService.setTableDataSource( profilePromoCode.result ) );
  //     } );
  // }
  //
  // private initTableProfile( id: number ) {
  //   const params = {
  //     promoCodeId: id,
  //     from: 0,
  //     count: 10,
  //     sortvalue: 'last_name'
  //   };
  //   this.addPromotionsCodsService.getProfiles( params )
  //     .pipe( takeWhile( _ => this.isActive ) )
  //     .subscribe( ( profilePromoCode: IProfilePromoCode ) => {
  //       this.tableAsyncService.countPage = profilePromoCode.totalCount;
  //       this.profilePromoCode = profilePromoCode;
  //       this.isLoader = false;
  //     } );
  // }


  searchForm(): void {

  }

  clearForm(): void {
    this.resetForm();
    this.router.navigate( [ '/crm/search-promotions-cods' ], { queryParams: {} } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
