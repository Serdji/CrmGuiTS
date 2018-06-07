import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { timer } from 'rxjs/observable/timer';
import { TableAsyncService } from './table-async.service';
import { IpagPage } from '../../interface/ipag-page';
import { Iprofile } from '../../interface/iprofile';

@Component( {
  selector: 'app-table-async',
  templateUrl: './table-async.component.html',
  styleUrls: [ './table-async.component.styl' ],
} )
export class TableAsyncComponent implements OnInit {

  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<any>;
  public isCp: boolean = false;
  public resultsLength: number;
  public isLoadingResults: boolean = false;

  @Input() public tableHeader: string[];
  @Input() private tableDataSource: any;

  @ViewChild( MatSort ) sort: MatSort;
  @ViewChild( MatPaginator ) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private tableAsyncService: TableAsyncService,
  ) { }

  ngOnInit(): void {
    this.initDisplayedColumns();
    this.initDataSource();
    this.initDataSourceAsync();
    this.initPaginator();
  }


  cursorPointer( elem: HTMLElement ): void {
    this.isCp = this.isChildMore( elem );
  }

  openText( elem: HTMLElement ): void {
    if ( this.isChildMore( elem ) ) {
      const text = elem.innerText;
      this.dialog.open( DialogComponent, {
        data: {
          message: text,
          status: 'text',
        },
      } );
    }
  }

  private initPaginator() {
    this.resultsLength = this.tableAsyncService.countPage;
    this.paginator.page.subscribe( ( value: IpagPage ) => {
      this.tableAsyncService.setPagPage( value );
      this.isLoadingResults = true;
    } );
  }

  private initDisplayedColumns() {
    for ( const header of this.tableHeader ) {
      this.displayedColumns.push( header[ 0 ] );
    }
  }

  private initDataSourceAsync() {
    this.tableAsyncService.subjectTableDataSource.subscribe( ( value: any ) => {
      this.dataSourceFun( value );
      this.isLoadingResults = false;
    } );
  }

  private initDataSource() {
    this.dataSourceFun( this.tableDataSource );
  }

  private dataSourceFun( params ) {
    this.dataSource = new MatTableDataSource( params );
    timer( 1 ).subscribe( _ => {
      this.dataSource.sort = this.sort;
    } );
  }

  private isChildMore( parentElement ): boolean {
    const getElemCss = getComputedStyle( parentElement );
    const parentWidth = parentElement.offsetWidth - parseInt( getElemCss.paddingRight, 10 );
    const childrenWidth = parentElement.firstElementChild.offsetWidth;
    return childrenWidth > parentWidth;

  }

}
