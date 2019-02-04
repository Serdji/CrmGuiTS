import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { IPromoCode } from '../../../../interface/ipromo-code';
import { PromoCodeService } from './promo-code.service';
import { takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';
import * as R from 'ramda';
import { validate } from 'codelyzer/walkerFactory/walkerFn';

@Component( {
  selector: 'app-promo-code',
  templateUrl: './promo-code.component.html',
  styleUrls: [ './promo-code.component.styl' ]
} )
export class PromoCodeComponent implements OnInit, OnDestroy {

  @Input() id: number;

  public progress: boolean;
  public promoCodes: IPromoCode;
  public nameButton: string;
  public isUsedHostRecLoc: boolean;
  public isPromoCodNull: boolean;

  private isActive: boolean;
  private isSortFilterReverse: boolean;

  constructor( private promoCodeService: PromoCodeService ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.progress = true;
    this.isSortFilterReverse = false;
    this.isPromoCodNull = false;
    this.nameButton = 'available';
    this.initPromoCodes();
  }

  private initPromoCodes() {
    const customerId = { 'customerId': this.id };
    const success = ( promoCodes: IPromoCode ) => {
      const sortByDateFrom = R.sortBy( R.prop( 'dateFrom' ), promoCodes.result );
      this.promoCodes = R.set( R.lensProp( 'result' ), sortByDateFrom, promoCodes );

      const totalCount = R.compose( R.length, R.prop( 'usedHostRecLoc' ) );
      const setUsedHostRecLocTotalCount = R.assoc( 'usedHostRecLocTotalCount' );
      const usedHostRecLocTotalCount = value => setUsedHostRecLocTotalCount( totalCount( value ), value );

      const upperFirstAndTotalCount = R.compose(
        usedHostRecLocTotalCount,
        R.over( R.lensProp( 'code' ), _.upperFirst ),
        R.over( R.lensPath( [ 'promotion', 'promotionName' ] ), _.upperFirst )
      );

      const resultMapping = R.map( upperFirstAndTotalCount, this.promoCodes.result );
      this.promoCodes = R.set( R.lensProp( 'result' ), resultMapping, this.promoCodes );

      const funcIsUsedHostRecLoc = R.compose( R.has( 'usedHostRecLoc' ), R.head, R.prop( 'result' ) );
      this.isUsedHostRecLoc = funcIsUsedHostRecLoc( this.promoCodes );

      this.isPromoCodNull = false;
      this.progress = false;
    };

    const error = _ => {
      this.isPromoCodNull = true;
      this.progress = false;
    };

    const availableByCustomer = id => this.promoCodeService.availableByCustomer( id )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( success, error );
    const usedByCustomer = id => this.promoCodeService.usedByCustomer( id )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( success, error );

    const whichButton = nameButton => () => nameButton === 'available';
    const whichMethod = R.ifElse( whichButton( this.nameButton ), availableByCustomer, usedByCustomer );

    whichMethod( customerId );
  }

  sortFilter( title: string ): void {
    const isSortFilterReverse = _ => this.isSortFilterReverse = !this.isSortFilterReverse;
    const isSortFilterReverseFunc = R.ifElse( isSortFilterReverse, R.identity, R.reverse );
    const sortByTitle = R.compose( R.sortBy, R.path, R.split( '.' ) );
    const funcSortByTitle = R.compose(
      isSortFilterReverseFunc,
      sortByTitle( title )
    );

    this.promoCodes.result = funcSortByTitle( this.promoCodes.result );
  }

  filterPromoCodes( key: string ): void {
    this.nameButton = key;
    this.progress = true;
    this.initPromoCodes();
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
