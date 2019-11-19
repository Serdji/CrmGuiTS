import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { timer } from 'rxjs/observable/timer';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { takeWhile } from 'rxjs/operators';
import { IpagPage } from '../../../interface/ipag-page';
import * as _ from 'lodash';
import { TableAsyncSearchPromoCodeService } from './table-async-search-promo-code.service';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component( {
  selector: 'app-table-async-search-promo-code',
  templateUrl: './table-async-search-promo-code.component.html',
  styleUrls: [ './table-async-search-promo-code.component.styl' ],
} )
export class TableAsyncSearchPromoCodeComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<any>;
  public isCp: boolean = false;
  public selection = new SelectionModel<any>( true, [] );
  public isDisabled: boolean;
  public resultsLength: number;
  public isLoadingResults: boolean = false;
  public totalCount: number;




  @Input() private tableDataSource: any;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private tableAsyncSearchPromoCodeService: TableAsyncSearchPromoCodeService
  ) { }

  ngOnInit(): void {

    this.initDataSource( this.tableDataSource );
    this.initDataSourceAsync();
    this.initPaginator();
    this.initDisplayedColumns();
  }

  private initDisplayedColumns() {
    this.displayedColumns = [
      'code',
      'promotionName',
      'accountCode',
      'dateFrom',
      'dateTo',
      'flightDateFrom',
      'flightDateTo',
      'promoCodeId',
    ];
  }

  private initDataSource( tableDataSources ) {
    _.each( tableDataSources, tableDataSource => {
      _.chain( tableDataSource )
        .set( 'promotionName', _.get( tableDataSource, 'promotion.promotionName' ) )
        .value();
    } );
    this.dataSourceFun( tableDataSources );
  }

  private initPaginator() {
    this.resultsLength = this.tableAsyncSearchPromoCodeService.countPage;
    this.totalCount = this.tableAsyncSearchPromoCodeService.countPage;
    this.paginator.page
      .pipe( untilDestroyed(this) )
      .subscribe( ( value: IpagPage ) => {
        this.tableAsyncSearchPromoCodeService.setPagPage( value );
        this.isLoadingResults = true;
      } );
  }

  private initDataSourceAsync() {
    this.tableAsyncSearchPromoCodeService.subjectTableDataSource
      .pipe( untilDestroyed(this) )
      .subscribe( ( value: any ) => {
        this.initDataSource( value );
        this.isLoadingResults = false;
      } );
  }

  private dataSourceFun( params ) {
    this.dataSource = new MatTableDataSource( params );
    timer( 1 )
      .pipe( untilDestroyed(this) )
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
    const parentWidth = parentElement.offsetWidth - parseInt( getElemCss.paddingRight, 10 );
    const childrenWidth = parentElement.firstElementChild.offsetWidth;
    return childrenWidth > parentWidth;

  }

  cursorPointer( elem: HTMLElement ): void {
    this.isCp = this.isChildMore( elem );
  }

  openText( elem: HTMLElement ): void {
    if ( this.isCp ) {
      const text = elem.innerText;
      this.windowDialog( text, 'text' );
    }
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
  }

  redirectToProfile( promoCodeId: number ): void {
    this.router.navigate( [ '/crm/add-promotions-codes'], { queryParams: { promoCodeId } } );
  }

  disabledCheckbox( eventData ): void {
    this.isDisabled = eventData;
  }

  ngOnDestroy(): void {}

}












