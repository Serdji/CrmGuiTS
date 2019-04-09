import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as R from 'ramda';

@Component({
  selector: 'app-privileges',
  templateUrl: './privileges.component.html',
  styleUrls: ['./privileges.component.styl']
})
export class PrivilegesComponent implements OnInit, OnDestroy {

  public progress: boolean;

  private isActive: boolean;
  private isSortFilterReverse: boolean;

  @Input() id: number;

  constructor() { }

  ngOnInit(): void {
    this.progress = true;
    this.isSortFilterReverse = false;
    this.isActive = true;
  }

  sortFilter( title: string ): void {
    const isSortFilterReverse = _ => this.isSortFilterReverse = !this.isSortFilterReverse;
    const isSortFilterReverseFunc = R.ifElse( isSortFilterReverse, R.identity, R.reverse );
    const sortByTitle = R.compose( R.sortBy, R.path, R.split( '.' ) );
    const funcSortByTitle = R.compose(
      isSortFilterReverseFunc,
      sortByTitle( title )
    );

    // this.promoCodes.result = funcSortByTitle( this.promoCodes.result );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
