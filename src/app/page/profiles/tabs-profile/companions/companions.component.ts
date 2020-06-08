import { Component, Input, OnInit } from '@angular/core';
import { ICompanions } from '../../../../interface/icompanions';
import { CompanionsService } from './companions.service';
import { map, pluck, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as R from 'ramda';

@Component( {
  selector: 'app-companions',
  templateUrl: './companions.component.html',
  styleUrls: [ './companions.component.styl' ]
} )
export class CompanionsComponent implements OnInit {

  @Input() id: number;

  public isLoader: boolean;
  public companions$: Observable<ICompanions[]>;

  private isSortFilterReverse: boolean;

  constructor(
    private companionsService: CompanionsService
  ) { }

  ngOnInit() {
    this.isLoader = true;
    this.isSortFilterReverse = false;
    this.initCompanions();
  }

  private initCompanions() {
    this.companions$ = this.companionsService.getCompanions( this.id )
      .pipe(
        pluck( 'result' ),
        tap( _ => this.isLoader = false )
      ) as Observable<ICompanions[]>;
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
