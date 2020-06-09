import { Component, Input, OnInit } from '@angular/core';
import { ICompanions, ICompanionOrders, ICoupons } from '../../../../interface/icompanions';
import { CompanionsService } from './companions.service';
import { map, pluck, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
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

  constructor(
    private fb: FormBuilder,
    private companionsService: CompanionsService,
    private convertToStream: ConvertToStream
  ) { }

  ngOnInit() {
    this.isLoader = true;
    this.isSortFilterReverse = false;
    this.initCompanions();
    this.initAirport();
    this.initForm();
  }

  private initCompanions() {
    this.companions$ = this.companionsService.getCompanions( this.id )
      .pipe(
        pluck( 'result' ),
        tap( _ => this.isLoader = false )
      ) as Observable<ICompanions[]>;
  }

  private initAirport() {
    this.airports$ = this.companions$
      .pipe(
        map( ( companions: ICompanions[] ) => {
          const airports = [];
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
