import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from '@angular/material';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { timer } from 'rxjs/observable/timer';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { takeWhile } from 'rxjs/operators';
import { IpagPage } from '../../../interface/ipag-page';
import { TableAsyncService } from '../../../services/table-async.service';
import * as _ from 'lodash';
import { TabsProfileService } from '../../../services/tabs-profile.service';

@Component( {
  selector: 'app-table-async-promo-code-profile',
  templateUrl: './table-async-promo-code-profile.component.html',
  styleUrls: [ './table-async-promo-code-profile.component.styl' ],
} )
export class TableAsyncPromoCodeProfileComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<any>;
  public isCp: boolean = false;
  public selection = new SelectionModel<any>( true, [] );
  public isDisabled: boolean;
  public resultsLength: number;
  public isLoadingResults: boolean = false;
  public totalCount: number;

  private isActive: boolean;


  @Input() private tableDataSource: any;

  @ViewChild( MatSort ) sort: MatSort;
  @ViewChild( MatPaginator ) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private tableAsyncService: TableAsyncService,
    private tabsProfileService: TabsProfileService,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.initDataSource( this.tableDataSource );
    this.initDataSourceAsync();
    this.initPaginator();
    this.initDisplayedColumns();
  }

  private initDisplayedColumns() {
    this.displayedColumns = [
      'firstName',
      'lastName',
      'secondName',
      'profileId',
      'customerId',
    ];
  }

  private initDataSource( tableDataSources ) {
    _.each( tableDataSources, tableDataSource => {
      const customerNames = _.find( tableDataSource.customerNames, [ 'customerNameType', 1 ] );
      _.chain( tableDataSource )
        .set( 'firstName', customerNames.firstName )
        .set( 'lastName', customerNames.lastName )
        .set( 'secondName', customerNames.secondName )
        .set( 'profileId', customerNames.customerId )
        .value();
    } );
    this.dataSourceFun( tableDataSources );
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

  private dataSourceFun( params ) {
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

  redirectToProfile( id: number ): void {
    this.router.navigate( [ `/crm/profile/${id}` ] );
    this.route.queryParams
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( queryParams => {
        const promoCodeId = +queryParams.promoCodeId;
        const params = {
          selectedIndex: 5,
          promoCode: {
            promoCodeId
          }
        };
        this.tabsProfileService.setControlTabsData = params;
      } );
  }

  disabledCheckbox( eventData ): void {
    this.isDisabled = eventData;
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}












