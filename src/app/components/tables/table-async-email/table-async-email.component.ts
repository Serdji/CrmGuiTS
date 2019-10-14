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
import * as _ from 'lodash';
import { detailExpand } from '../../../animations/animations';
import { TableAsyncService } from '../../../services/table-async.service';
import { IpagPage } from '../../../interface/ipag-page';

@Component( {
  selector: 'app-table-async-email',
  templateUrl: './table-async-email.component.html',
  styleUrls: [ './table-async-email.component.styl' ],
  animations: [ detailExpand ],
} )
export class TableAsyncEmailComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<any>;
  public isCp: boolean = false;
  public selection = new SelectionModel<any>( true, [] );
  public isDisabled: boolean;
  public expandedElement: PeriodicElement | null;
  public resultsLength: number;
  public isLoadingResults: boolean = false;
  public totalCount: number;


  private isActive: boolean;

  @Input() private tableDataSource: PeriodicElement[];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private tableAsyncService: TableAsyncService,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.initDataSource();
    this.initDisplayedColumns();
    this.initPaginator();
    this.initDataSourceAsync();

  }

  private initDisplayedColumns() {
    this.displayedColumns = [
      'select',
      'subject',
      'statusNameRus',
      'dateFrom',
      'dateTo',
      'lastTryDT',
      'distributionId',
    ];
  }

  private initPaginator() {
    this.resultsLength = this.tableAsyncService.countPage;
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
        this.dataSourceFun( value );
        this.isLoadingResults = false;
      } );
  }

  private initDataSource() {
    _.each( this.tableDataSource, value => {
      _( value )
        .set( 'statusNameRus', value.status.statusNameRus )
        .set( 'distributionStatusId', value.status.distributionStatusId )
        .value();
    } );
    this.dataSourceFun( this.tableDataSource );
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

  applyFilter( filterValue: string ): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  deleteDisplayed(): void {
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
      this.windowDialog( `DIALOG.DELETE.DISTRIBUTION`, 'delete', params, 'displayeds' );
    }
  }

  redirectToDistribution( id: number ): void {
    this.router.navigate( [ `/crm/profile-email-distribution/${id}` ] );
  }

  disabledCheckbox( eventData ): void {
    this.isDisabled = eventData;
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}

export interface PeriodicElement {
  status: any;
  select: any;
  subject: string;
  statusNameRus: string;
  dateFrom: string;
  dateTo: string;
  lastTryDT: string;
  distributionId: number;
  distributionStatuses: any;
}












