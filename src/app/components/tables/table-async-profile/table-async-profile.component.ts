import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { timer } from 'rxjs/observable/timer';
import { IpagPage } from '../../../interface/ipag-page';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { Iprofile } from '../../../interface/iprofile';
import { takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';
import { TableAsyncService } from '../../../services/table-async.service';

@Component( {
  selector: 'app-table-async-profile',
  templateUrl: './table-async-profile.component.html',
  styleUrls: [ './table-async-profile.component.styl' ],
} )
export class TableAsyncProfileComponent implements OnInit, OnDestroy {

  public displayedColumns: string[];

  public dataSource: MatTableDataSource<any>;
  public isCp: boolean = false;
  public resultsLength: number;
  public isLoadingResults: boolean = false;
  public selection = new SelectionModel<any>( true, [] );
  public isDisabled: boolean;
  public ids: any;
  public totalCount: number;
  public lessThanTwo: boolean;

  private isActive: boolean = true;

  @Input() private tableDataSource: any;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private tableAsyncService: TableAsyncService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.lessThanTwo = true;
    this.initDataSource( this.tableDataSource );
    this.initDataSourceAsync();
    this.initPaginator();
    this.initDisplayedColumns();
  }


  cursorPointer( elem: HTMLElement ): void {
    this.isCp = this.isChildMore( elem );
  }

  openText( elem: HTMLElement ): void {
    if ( this.isChildMore( elem ) ) {
      const text = elem.innerText;
      this.windowDialog( text, 'text' );
    }
  }

  private initDisplayedColumns() {
    this.displayedColumns = JSON.parse( localStorage.getItem( 'tableAsyncProfile' ) );
    this.displayedColumns.unshift( 'select' );
    this.displayedColumns.push( 'customerId' );
  }


  private initPaginator() {
    this.resultsLength = this.tableAsyncService.countPage;
    this.totalCount = this.tableAsyncService.countPage;
    this.paginator.page
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: IpagPage ) => {
        this.tableAsyncService.setPagPage( value );
        this.isLoadingResults = true;
      } );
  }


  private initDataSourceAsync() {
    this.tableAsyncService.subjectTableDataSource
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: any ) => {
        this.initDataSource( value );
        this.isLoadingResults = false;
      } );
  }

  private initDataSource( params: Iprofile[] ) {
    _.each( params, tableDataSource => _.set( tableDataSource, 'customerIds', tableDataSource.customerId ) );
    this.dataSourceFun( params );
  }

  private dataSourceFun( params: Iprofile[] ) {
    params = params.map( ( value: any ) => {
      Object.assign( value, value.customerNames.filter( customerName => customerName.customerNameType === 1 )[ 0 ] );
      return value;
    } );
    this.dataSource = new MatTableDataSource( params );
    timer( 1 )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        this.dataSource.sort = this.sort;
      } );
  }

  private windowDialog( messDialog: string, status: string, params: any = '', card: string = '' ) {
    this.dialog.open( DialogComponent, {
      data: {
        message: messDialog,
        status,
        params,
        card,
      },
    } );
  }

  private isChildMore( parentElement ): boolean {
    const getElemCss = getComputedStyle( parentElement );
    const parentWidth = parentElement.offsetWidth - parseInt( getElemCss.paddingRight, 10 ) - parseInt( getElemCss.paddingLeft, 10 );
    const childrenWidth = parentElement.firstElementChild.offsetWidth;
    return childrenWidth >= parentWidth;

  }

  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }


  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach( row => this.selection.select( row ) );
    timer( 100 )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => this.isIds() );
  }

  editCreate( id ): void {
    this.router.navigate( [ `/crm/profile/${id}` ] );
  }

  deleteProfile(): void {
    const arrayId = [];
    const checkbox = Array.from( document.querySelectorAll( 'mat-table input' ) );
    checkbox.forEach( ( el: HTMLInputElement ) => {
      if ( el.checked ) {
        const id = el.id.split( '-' );
        if ( Number.isInteger( +id[ 0 ] ) ) arrayId.push( +id[ 0 ] );
      }
    } );

    if ( arrayId.length !== 0 ) {
      const params = Object.assign( {}, { ids: arrayId } );
      this.windowDialog( `DIALOG.DELETE.PROFILES`, 'delete', params, 'profiles' );
    }
  }

  disabledCheckbox( eventData ): void {
    this.isDisabled = eventData;
  }

  isIds(): void {
    const arrayId = [];
    const checkbox = Array.from( document.querySelectorAll( 'mat-table input' ) );
    checkbox.forEach( ( el: HTMLInputElement ) => {
      if ( el.checked ) {
        const id = el.id.split( '-' );
        if ( Number.isInteger( +id[ 0 ] ) ) arrayId.push( +id[ 0 ] );
      } else {
        this.ids = {};
      }
    } );

    if ( arrayId.length !== 0 ) {
      this.ids = { customerIds: arrayId };
      this.lessThanTwo = this.ids.customerIds.length < 2;
    }
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
