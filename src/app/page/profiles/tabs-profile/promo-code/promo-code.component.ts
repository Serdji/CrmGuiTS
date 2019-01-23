import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { IPromoCode } from '../../../../interface/ipromo-code';
import { PromoCodeService } from './promo-code.service';
import { takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';

@Component( {
  selector: 'app-promo-code',
  templateUrl: './promo-code.component.html',
  styleUrls: [ './promo-code.component.styl' ]
} )
export class PromoCodeComponent implements OnInit, OnDestroy {

  @Input() id: number;

  public progress: boolean;
  public promoCodes: IPromoCode;

  private isActive: boolean;
  private isSortFilterReverse: boolean;

  constructor( private promoCodeService: PromoCodeService ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.progress = true;
    this.isSortFilterReverse = false;
    this.initPromoCodes();
  }

  private initPromoCodes() {
    this.promoCodeService.getPromoCodes( { 'customerId': this.id } )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( promoCodes: IPromoCode ) => {

        const setValue = _.curry( ( path, value, arr ) => _.set( arr, path, value ) );
        const setUpperFirst = _.curry( ( path, arr ) => setValue( path, _.upperFirst( _.get( arr, path ) ), arr ) );
        const setValIsType = _.curry( ( path, arr ) => setValue( path, _.get( arr, path ) === 1 ? 'сумма' : 'процент', arr ) );

        const composeResultTitleUpperFirst = _.flow( [ setUpperFirst( 'code' ), setUpperFirst( 'promotion.promotionName' ), setValIsType( 'promoCodeValTypeId' ) ] );
        const mapResultTitleUpperFirst = result => composeResultTitleUpperFirst( result );

        const composeResultMapSort = _.flow( [
          setValue( 'result', _.map( promoCodes.result, mapResultTitleUpperFirst ) ),
          setValue( 'result', _.sortBy( promoCodes.result, 'dateFrom' ) )
        ] );

        this.promoCodes = composeResultMapSort( promoCodes );
        this.progress = false;
      } );
  }

  sortFilter( title: string ): void {
    this.isSortFilterReverse = !this.isSortFilterReverse;

    const sortByTitle = _.curry( ( titleEvn, arr ) => _.sortBy( arr, titleEvn ) );
    const sortFilterRevers = _.curry( ( isSortFilterReverse, arr ) => isSortFilterReverse ? arr : _.reverse( arr ) );
    const composeSortByTitle = _.flow( [ sortByTitle( title ), sortFilterRevers( this.isSortFilterReverse ) ] );

    this.promoCodes.result = composeSortByTitle( this.promoCodes.result );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
