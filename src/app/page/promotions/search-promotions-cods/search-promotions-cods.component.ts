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
  public promotions: IPromotions;

  private isActive: boolean;
  private autDelay: number;

  constructor(
    private searchPromotionsCodsService: SearchPromotionsCodsService,
    private addPromotionsService: AddPromotionsService,
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
      // dep_Location: '',
      // arr_Location: '',
      // customersIds: '',
      // segmentations: '',
      // customerGroups: '',
      // usesPerPerson: '',
      // usesTotal: '',
      val: '',
      // promoCodeValTypeId: '',
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
    // this.locationFromOptions = this.autocomplete( 'dep_Location', 'location' );
    // this.locationToOptions = this.autocomplete( 'arr_Location', 'location' );
    // this.segmentationOptions = this.autocomplete( 'segmentations', 'segmentations' );
    // this.customerGroupOptions = this.autocomplete( 'customerGroups', 'customerGroups' );
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
            // case 'location':
            //   if ( val ) return this.locations.filter( location => location.locationCode.toLowerCase().includes( val.toLowerCase() ) );
            //   break;
            // case 'segmentations':
            //   if ( val !== null ) return this.segmentation.filter( segmentation => segmentation.title.toLowerCase().includes( val.toLowerCase() ) );
            //   break;
            // case 'customerGroups':
            //   return this.customerGroup.filter( customerGroup => {
            //       if ( val !== null ) return customerGroup.customerGroupName.toLowerCase().includes( val.toLowerCase() );
            //     }
            //   );
            //   break;
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
