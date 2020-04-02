import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddPromotionsService } from './add-promotions.service';
import { takeWhile } from 'rxjs/operators';
import { IPromotions } from '../../../interface/ipromotions';
import { IpagPage } from '../../../interface/ipag-page';
import { timer } from 'rxjs';
import { TableAsyncService } from '../../../services/table-async.service';
import * as R from 'ramda';
import { ProfileSearchService } from '../../profiles/profile-search/profile-search.service';
import { SearchPromotionsCodesService } from '../search-promotions-codes/search-promotions-codes.service';
import { ActivatedRoute } from '@angular/router';
import { IPromoCodes } from '../../../interface/ipromo-code';
import { TableAsyncSearchPromoCodeService } from '../../../components/tables/table-async-search-promo-code/table-async-search-promo-code.service';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component( {
  selector: 'app-add-promotions',
  templateUrl: './add-promotions.component.html',
  styleUrls: [ './add-promotions.component.styl' ]
} )
export class AddPromotionsComponent implements OnInit, OnDestroy {

  public isLoaderPromotions: boolean;
  public isLoaderPromoCode: boolean;
  public isTablePromoCode: boolean;
  public formPromotions: FormGroup;
  public promotions: IPromotions;
  public promoCode: IPromoCodes;


  private promotionName: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private addPromotionsService: AddPromotionsService,
    private tableAsyncService: TableAsyncService,
    private tableAsyncSearchPromoCodeService: TableAsyncSearchPromoCodeService,
    private searchPromotionsCodesService: SearchPromotionsCodesService,
  ) { }

  ngOnInit(): void {

    this.isLoaderPromotions = true;
    this.isLoaderPromoCode = true;
    this.isTablePromoCode = false;
    this.initForm();
    this.initTablePromotions();
    this.initTablePromotionsPagination();
    this.initTablePromoCodePagination();
    this.initQueryParams();
    this.addPromotionsService.subjectDeletePromotions
      .pipe( untilDestroyed(this) )
      .subscribe( _ => {
        this.isLoaderPromotions = true;
        timer( 300 )
          .pipe( untilDestroyed(this) )
          .subscribe( _ => this.initTablePromotions() );
      } );
  }


  private initQueryParams() {
    this.route.queryParams
      .pipe( untilDestroyed(this) )
      .subscribe( ( res: { promotionName: number[], from: number, count: number } ) => {
        const isRes = !R.isEmpty( res );
        if ( isRes ) this.initProfileCodes( res );
      } );
  }

  private initProfileCodes( searchParams ) {
    this.promotionName = searchParams.promotionName;
    this.isTablePromoCode = true;
    this.isLoaderPromoCode = true;
    this.searchPromotionsCodesService.getSearchPromotionsCodes( searchParams )
      .pipe( untilDestroyed(this) )
      .subscribe( ( promoCode: IPromoCodes ) => {
        this.tableAsyncSearchPromoCodeService.countPage = promoCode.totalCount;
        this.promoCode = promoCode;
        this.isLoaderPromoCode = false;
      } );
  }


  private initTablePromoCodePagination() {
    this.tableAsyncSearchPromoCodeService.subjectPage
      .pipe( untilDestroyed(this) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;
        const paramsAndCount = {
          promotionName: this.promotionName,
          from: pageIndex,
          count: value.pageSize
        };
        this.searchPromotionsCodesService.getSearchPromotionsCodes( paramsAndCount )
          .pipe( untilDestroyed(this) )
          .subscribe( ( promoCode: IPromoCodes ) => this.tableAsyncSearchPromoCodeService.setTableDataSource( promoCode.result ) );
      } );
  }

  private initForm() {
    this.formPromotions = this.fb.group( {
      promotionName: ''
    } );
  }

  private initTablePromotionsPagination() {
    this.tableAsyncService.subjectPage
      .pipe( untilDestroyed(this) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;
        const paramsAndCount = {
          from: pageIndex,
          count: value.pageSize
        };
        this.addPromotionsService.getAllPromotions( paramsAndCount )
          .pipe( untilDestroyed(this) )
          .subscribe( ( promotions: IPromotions ) => this.tableAsyncService.setTableDataSource( promotions.result ) );
      } );
  }

  private initTablePromotions() {
    const params = {
      from: 0,
      count: 10
    };
    this.addPromotionsService.getAllPromotions( params )
      .pipe( untilDestroyed(this) )
      .subscribe( ( promotions: IPromotions ) => {
        this.tableAsyncService.countPage = promotions.totalCount;
        this.promotions = promotions;
        this.isLoaderPromotions = false;
      } );
  }

  saveForm(): void {
    this.isLoaderPromotions = true;
    this.addPromotionsService.savePromotions( this.formPromotions.getRawValue() )
      .pipe( untilDestroyed(this) )
      .subscribe( _ => {
        this.formPromotions.get( 'promotionName' ).patchValue( '' );
        this.initTablePromotions();
      } );
  }

  ngOnDestroy(): void {}

}














