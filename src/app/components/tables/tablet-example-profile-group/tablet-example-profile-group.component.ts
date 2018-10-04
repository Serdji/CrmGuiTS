import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from '@angular/material';
import { timer } from 'rxjs/observable/timer';
import { SelectionModel } from '@angular/cdk/collections';
import { takeWhile } from 'rxjs/operators';

@Component( {
  selector: 'app-tablet-example-profile-group',
  templateUrl: './tablet-example-profile-group.component.html',
  styleUrls: [ './tablet-example-profile-group.component.styl' ],
} )
export class TabletExampleProfileGroupComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<any>;
  public selection = new SelectionModel<any>( true, [] );
  private isActive: boolean;

  @Input() private tableDataSource: any;

  @ViewChild( MatSort ) sort: MatSort;
  @ViewChild( MatPaginator ) paginator: MatPaginator;

  constructor() { }

  ngOnInit(): void {
    this.isActive = true;
    this.initDataSource();
    this.initDisplayedColumns();
  }

  private initDisplayedColumns() {
    this.displayedColumns = [
      'customerGroupName',
    ];
  }

  private initDataSource() {
    this.dataSourceFun( this.tableDataSource );
  }

  private dataSourceFun( params ) {
    this.dataSource = new MatTableDataSource( params );
    timer( 1 )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}












