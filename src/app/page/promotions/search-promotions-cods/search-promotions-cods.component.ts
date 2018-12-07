import { Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchPromotionsCodsService } from './search-promotions-cods.service';
import { FormBuilder } from '@angular/forms';
import { TableAsyncService } from '../../../services/table-async.service';
import { takeWhile } from 'rxjs/operators';
import { IpagPage } from '../../../interface/ipag-page';
import { IProfilePromoCode } from '../../../interface/iprofile-promo-code';

@Component({
  selector: 'app-search-promotions-cods',
  templateUrl: './search-promotions-cods.component.html',
  styleUrls: ['./search-promotions-cods.component.styl']
})
export class SearchPromotionsCodsComponent implements OnInit, OnDestroy {

  public isTable: boolean;
  public isLoader: boolean;

  private isActive: boolean;

  constructor(
    private searchPromotionsCodsService: SearchPromotionsCodsService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tableAsyncService: TableAsyncService,
  ) { }

  ngOnInit() {
    this.isActive = true;
    this.isLoader = true;
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


  // private resetForm() {
  //   this.promoCodeBrandListChips = [];
  //   this.promoCodeFlightListChips = [];
  //   this.promoCodeRbdListChips = [];
  //   this.promoCodeCustomerListChips = [];
  //   this.promoCodeRouteList = [];
  //   this.segmentationChips = [];
  //   this.customerGroupChips = [];
  //   _( this.formPromoCods.value ).each( ( value, key ) => {
  //     this.formPromoCods.get( key ).patchValue( '' );
  //     this.formPromoCods.get( key ).setErrors( null );
  //   } );
  //   this.buttonSave = false;
  //   this.buttonCreate = true;
  //   this.buttonSearch = true;
  //   this.buttonDelete = true;
  // }
  //


  searchForm(): void {

  }

  clearForm(): void{
    // this.resetForm();
    // this.router.navigate( [ '/crm/add-promotions-cods' ], { queryParams: {} } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
