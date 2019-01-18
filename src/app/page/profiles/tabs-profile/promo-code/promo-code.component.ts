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
        this.promoCodes = promoCodes;

        const setUpperFirst = _.curry( ( path, obj ) => _.set( obj, path, _.upperFirst( _.get( obj, path ) ) ) );
        const setValue = _.curry( ( path, value, obj ) => _.set( obj, path, value ) );
        const composeResultTitleUpperFirst = _.flow( [ setUpperFirst( 'code' ), setUpperFirst( 'promotion.promotionName' ) ] );
        const mapResultTitleUpperFirst = result => composeResultTitleUpperFirst( result );
        const composeResultMapSort = _.flow( [
          setValue( 'result', _.map( this.promoCodes.result, mapResultTitleUpperFirst ) ),
          setValue( 'result', _.sortBy( this.promoCodes.result, 'dateFrom' ) )
        ] );

        composeResultMapSort( this.promoCodes );

        this.progress = false;
      } );
  }

  sortFilter( title: string ): void {
    this.promoCodes.result = _.chain( this.promoCodes.result )
      .sortBy( title )
      .tap( val => {
        this.isSortFilterReverse = !this.isSortFilterReverse;
        if ( this.isSortFilterReverse ) return val;
        else return _.reverse( val );
      } )
      .value();
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
