import { Component, Input, OnInit } from '@angular/core';
import { ICompanions, ICompanionOrders, ICoupons } from '../../../../interface/icompanions';
import { CompanionsService } from './companions.service';
import { filter, map, pluck, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as R from 'ramda';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConvertToStream } from '../../../../utils/ConvertToStream';
import * as _ from 'lodash';

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
    this.initFilterAirport();
  }

  private initCompanions() {
    this.companions$ = this.companionsService.getCompanions( this.id )
      .pipe(
        pluck( 'result' ),
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

  private initFilterAirport() {
    _.each( [ 'from', 'to' ], ( formName: string ) => {
      this.formFilter.get( formName ).valueChanges
        .pipe(
          switchMap( value => {
            return of( this.originCompanions )
              .pipe(
                this.convertToStream.stream(
                  filter( ( companion: ICompanions ) => {
                    let isFilter: boolean;
                    _.each( companion.orders, ( order: ICompanionOrders ) => {
                      _.each( order.coupons, ( coupon: ICoupons ) => {
                        isFilter = _.isUndefined( value ) ? _.isUndefined( value ) : coupon[ formName ] === value;
                      } );
                    } );
                    return isFilter;
                  } ),
                )
              );
          } ),
        ).subscribe( ( companion: ICompanions[] ) => this.companions$ = of( companion ) as Observable<ICompanions[]> );
    } );
  }

  private initForm() {
    this.formFilter = this.fb.group( {
      from: '',
      to: '',
      depDateFrom: '',
      depDateTo: ''
    } );
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
