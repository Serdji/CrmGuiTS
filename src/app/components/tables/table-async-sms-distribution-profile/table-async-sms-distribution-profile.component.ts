import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { timer } from 'rxjs/observable/timer';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { IpagPage } from '../../../interface/ipag-page';
import { TableAsyncService } from '../../../services/table-async.service';
import { TabsProfileService } from '../../../services/tabs-profile.service';
import * as R from 'ramda';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component( {
  selector: 'app-table-async-sms-distribution-profile',
  templateUrl: './table-async-sms-distribution-profile.component.html',
  styleUrls: [ './table-async-sms-distribution-profile.component.styl' ],
} )
export class TableAsyncSmsDistributionProfileComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<any>;
  public isCp: boolean = false;
  public selection = new SelectionModel<any>( true, [] );
  public isDisabled: boolean;
  public resultsLength: number;
  public isLoadingResults: boolean = false;




  @Input() private tableDataSource: any;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private tableAsyncService: TableAsyncService,
    private tabsProfileService: TabsProfileService,
  ) { }

  ngOnInit(): void {

    this.initDataSource();
    this.initDataSourceAsync();
    this.initPaginator();
    this.initDisplayedColumns();
  }

  private initDisplayedColumns() {
    this.displayedColumns = [
      'firstName',
      'lastName',
      'secondName',
      'distributionCustomerStatus',
      'errorMessage',
      'distributionCustomerId',
    ];
  }

  private initDataSource() {
    this.dataSourceFun( this.tableDataSource );
  }

  private initPaginator() {
    this.resultsLength = this.tableAsyncService.countPage;
    this.paginator.page
      .pipe( untilDestroyed(this) )
      .subscribe( ( value: IpagPage ) => {
        this.tableAsyncService.setPagPage( value );
        this.isLoadingResults = true;
      } );
  }

  private initDataSourceAsync() {
    this.tableAsyncService.subjectTableDataSource
      .pipe( untilDestroyed(this) )
      .subscribe( ( value: any ) => {
        this.dataSourceFun( value );
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

  redirectToDisplayed( id: number ): void {
    this.router.navigate( [ `/crm/profile/${id}` ] );
    const splitUrl = R.split( '/' );
    // @ts-ignore
    const lastParamsUrl = R.compose( R.last, splitUrl );
    const distributionId = +lastParamsUrl( this.router.url );
    const params = {
      selectedIndex: 4,
      message: {
        distributionId
      }
    };
    this.tabsProfileService.setControlTabsData = params;
  }

  disabledCheckbox( eventData ): void {
    this.isDisabled = eventData;
  }

  ngOnDestroy(): void {}

}












