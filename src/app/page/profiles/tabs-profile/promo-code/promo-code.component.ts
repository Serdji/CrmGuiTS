import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { IPromoCode } from '../../../../interface/ipromo-code';
import { PromoCodeService } from './promo-code.service';
import { takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';
import * as R from 'ramda';

@Component( {
  selector: 'app-promo-code',
  templateUrl: './promo-code.component.html',
  styleUrls: [ './promo-code.component.styl' ]
} )
export class PromoCodeComponent implements OnInit, OnDestroy {

  @Input() id: number;

  public progress: boolean;
  public promoCodes: IPromoCode;
  public styleButton: string;

  private isActive: boolean;
  private isSortFilterReverse: boolean;

  constructor( private promoCodeService: PromoCodeService ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.progress = true;
    this.isSortFilterReverse = false;
    this.styleButton = 'available';
    this.initPromoCodes();
  }

  private initPromoCodes() {
    this.promoCodeService.availableByCustomer( { 'customerId': this.id } )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( promoCodes: IPromoCode ) => {
        const sortByDateFrom = R.sortBy( R.prop( 'dateFrom' ), promoCodes.result );
        this.promoCodes = R.set( R.lensProp( 'result' ), sortByDateFrom, promoCodes );

        const upperFirst = R.compose(
          R.over( R.lensProp( 'code' ), _.upperFirst ),
          R.over( R.lensPath( [ 'promotion', 'promotionName' ] ), _.upperFirst )
        );
        const resultMap = R.map( upperFirst, this.promoCodes.result );
        this.promoCodes = R.set( R.lensProp( 'result' ), resultMap, this.promoCodes );

        this.progress = false;
      } );
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
    this.styleButton = key;
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
