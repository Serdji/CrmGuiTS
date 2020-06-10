import { Component, Input, OnInit } from '@angular/core';
import { ICompanions, ICompanionOrders, ICoupons } from '../../../../interface/icompanions';
import { CompanionsService } from './companions.service';
import { filter, map, pluck, switchMap, tap } from 'rxjs/operators';
import { combineLatest, Observable, of } from 'rxjs';
import * as R from 'ramda';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConvertToStream } from '../../../../utils/ConvertToStream';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component( {
  selector: 'app-companions',
  templateUrl: './companions.component.html',
  styleUrls: [ './companions.component.styl' ]
} )
export class CompanionsComponent implements OnInit {

  @Input() id: number;

  public isLoader: boolean;
  public companions$: Observable<ICompanions[]>;
  public airports$: Observable<string[]>;
  public dates$: Observable<string[]>;
  public formFilter: FormGroup;

  private isSortFilterReverse: boolean;
  private originCompanions: ICompanions[];

  constructor(
    private fb: FormBuilder,
    private companionsService: CompanionsService,
    private convertToStream: ConvertToStream
  ) { }

  ngOnInit() {
    this.isLoader = true;
    this.isSortFilterReverse = false;
    this.initForm();
    this.initCompanions();
    this.initAirport();
    this.initDate();
    this.initFilterAirport();
    this.initFilterIntervalDate();
  }

  private initCompanions() {
    this.companions$ = this.companionsService.getCompanions( this.id )
      .pipe(
        pluck( 'result' ),
        map(
          ( companions: ICompanions[] ) => {
            return _.map( companions, ( companion: ICompanions ) => {
              return {
                ...companion,
                orders: _.map( companion.orders, ( order: ICompanionOrders ) => {
                  return {
                    ...order,
                    coupons: _.map( order.coupons, ( coupon: ICoupons ) => {
                      return {
                        ...coupon,
                        depDate: new Date( coupon.depDate )
                      };
                    } )
                  };
                } )
              };
            } );
          }
        ),
        map( ( companions: ICompanions[] ) => {
          companions = _.map( companions, ( companion: ICompanions ) => {
            const orders = _.map( companion.orders, ( order: ICompanionOrders ) => {
              return {
                ...order,
                coupons: _.sortBy( order.coupons, 'depDate' )
              };
            } );
            return {
              ...companion,
              orders: _.sortBy( orders, ( order: ICompanionOrders ) => order.coupons[ 0 ].depDate )
            };
          } );
          return _.sortBy( companions, ( companion: ICompanions ) => companion.orders[ 0 ].coupons[ 0 ].depDate );
        } ),
        map(
          ( companions: ICompanions[] ) => {
            return _.map( companions, ( companion: ICompanions ) => {
              return {
                ...companion,
                orders: _.map( companion.orders, ( order: ICompanionOrders ) => {
                  return {
                    ...order,
                    coupons: _.map( order.coupons, ( coupon: ICoupons ) => {
                      return {
                        ...coupon,
                        depDate: moment( coupon.depDate ).format( 'DD.MM.YYYY' )
                      };
                    } )
                  };
                } )
              };
            } );
          }
        ),
        tap( ( companions: ICompanions[] ) => this.originCompanions = companions ),
        tap( _ => this.isLoader = false )
      ) as Observable<ICompanions[]>;
  }

  private initAirport() {
    this.airports$ = this.companions$
      .pipe(
        map( ( companions: ICompanions[] ) => {
          const airports: string[] = [];
          _.each( companions, ( companion: ICompanions ) => {
            _.each( companion.orders, ( order: ICompanionOrders ) => {
              _.each( order.coupons, ( coupon: ICoupons ) => {
                airports.push( coupon.from );
                airports.push( coupon.to );
              } );
            } );
          } );
          return _.uniq( airports );
        } )
      ) as Observable<string[]>;
  }

  private initDate() {
    this.dates$ = this.companions$
      .pipe(
        map( ( companions: ICompanions[] ) => {
          const dates = [];
          _.each( companions, ( companion: ICompanions ) => {
            _.each( companion.orders, ( order: ICompanionOrders ) => {
              _.each( order.coupons, ( coupon: ICoupons ) => {
                dates.push( coupon.depDate );
              } );
            } );
          } );
          return _.uniq( dates );
        } )
      ) as Observable<string[]>;
  }

  private initFilterAirport() {

    this.formFilter.get( 'switchFromTo' ).valueChanges
      .pipe(
        tap( _ => this.formFilter.get( 'airportValue' ).enable() ),
        map( switchFromTo => {
          this.formFilter.get( 'airportValue' ).patchValue( undefined );
          if ( _.isUndefined( switchFromTo ) ) {
            this.formFilter.get( 'airportValue' ).patchValue( switchFromTo );
            this.formFilter.get( 'airportValue' ).disable();
            return switchFromTo;
          }
          return switchFromTo;
        } ),
        switchMap( switchFromTo => {
          return this.formFilter.get( 'airportValue' ).valueChanges
            .pipe(
              switchMap( airportValue => {
                return of( this.originCompanions )
                  .pipe(
                    this.convertToStream.stream(
                      filter( ( companion: ICompanions ) => {
                        let isFilter: boolean;
                        _.each( companion.orders, ( order: ICompanionOrders ) => {
                          _.each( order.coupons, ( coupon: ICoupons ) => {
                            isFilter = _.isUndefined( airportValue ) ? _.isUndefined( airportValue ) : coupon[ switchFromTo ] === airportValue;
                          } );
                        } );
                        return isFilter;
                      } ),
                    )
                  );
              } ),
            );
        } )
      ).subscribe( ( companion: ICompanions[] ) => this.companions$ = of( companion ) as Observable<ICompanions[]> );
  }

  private initFilterIntervalDate() {

    const intervalFilter$ = combineLatest( [
      this.companions$,
      this.formFilter.get( 'depDateFrom' ).valueChanges,
      this.formFilter.get( 'depDateTo' ).valueChanges
    ] );

    intervalFilter$.subscribe( ( [ companions, depDateFrom, depDateTo ]: [ ICompanions[], string, string ] ) => {
      const predicate = ( date ) => ( {
        orders: [
          {
            coupons: [
              { depDate: date }
            ]
          }
        ]
      } );

      const start = _.findIndex( companions, predicate( depDateFrom ) ) !== -1 ? _.findIndex( companions, predicate( depDateFrom ) ) : 0;
      const end = _.findLastIndex( companions, predicate( depDateTo ) ) !== -1 ? _.findLastIndex( companions, predicate( depDateTo ) ) : companions.length - 1;

      console.log( start, end );
    } );
  }

  private initForm() {
    this.formFilter = this.fb.group( {
      switchFromTo: '',
      airportValue: '',
      depDateFrom: '',
      depDateTo: ''
    } );
    this.formFilter.get( 'airportValue' ).disable();
  }

  onSortFilter( title: string ): void {
    const isSortFilterReverse = _ => this.isSortFilterReverse = !this.isSortFilterReverse;
    const isSortFilterReverseFunc = R.ifElse( isSortFilterReverse, R.identity, R.reverse );
    const sortByTitle = R.compose( R.sortBy, R.path, R.split( '.' ) );
    const funcSortByTitle = R.compose(
      isSortFilterReverseFunc,
      sortByTitle( title )
    );

    this.companions$ = this.companions$.pipe( map( ( companions: ICompanions[] ) => funcSortByTitle( companions ) ) );
  }


}
