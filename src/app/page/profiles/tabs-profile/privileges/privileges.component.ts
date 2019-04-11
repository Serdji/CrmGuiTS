import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as R from 'ramda';
import { PrivilegesService } from './privileges.service';
import { takeWhile } from 'rxjs/operators';
import { IPrivileges } from '../../../../interface/iprivileges';

@Component( {
  selector: 'app-privileges',
  templateUrl: './privileges.component.html',
  styleUrls: [ './privileges.component.styl' ]
} )
export class PrivilegesComponent implements OnInit, OnDestroy {

  public progress: boolean;
  public privileges: IPrivileges;

  private isActive: boolean;
  private isSortFilterReverse: boolean;

  @Input() id: number;

  constructor( private privilegesService: PrivilegesService ) { }

  ngOnInit(): void {
    this.progress = true;
    this.isSortFilterReverse = false;
    this.isActive = true;
    this.initPrivileges();
  }

  private initPrivileges() {
    const success = ( value: IPrivileges ) => this.privileges = value;
    this.privilegesService.getPrivileges( this.id )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( success );
  }

  onSortFilter( title: string ): void {
    const isSortFilterReverse = _ => this.isSortFilterReverse = !this.isSortFilterReverse;
    const isSortFilterReverseFunc = R.ifElse( isSortFilterReverse, R.identity, R.reverse );
    const sortByTitle = R.compose( R.sortBy, R.path, R.split( '.' ) );
    const funcSortByTitle = R.compose(
      isSortFilterReverseFunc,
      sortByTitle( title )
    );

    this.privileges.result = funcSortByTitle( this.privileges.result );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
