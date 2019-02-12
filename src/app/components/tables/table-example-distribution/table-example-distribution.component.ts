import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from '@angular/material';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { timer } from 'rxjs/observable/timer';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component( {
  selector: 'app-table-example-distribution',
  templateUrl: './table-example-distribution.component.html',
  styleUrls: [ './table-example-distribution.component.styl' ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
} )
export class TableExampleDistributionComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<any>;
  public isCp: boolean = false;
  public selection = new SelectionModel<any>( true, [] );
  public isDisabled: boolean;
  public expandedElement: PeriodicElement | null;

  private isActive: boolean;

  @Input() private tableDataSource: PeriodicElement[];

  @ViewChild( MatSort ) sort: MatSort;
  @ViewChild( MatPaginator ) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.initDataSource();
    this.initDisplayedColumns();
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
        this.dataSource.paginator = this.paginator;
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
      this.windowDialog( `Вы действительно хотите удалить ${ arrayId.length === 1 ? 'рассылку' : 'рассылки' } ?`, 'delete', params, 'displayeds' );
    }
  }

  redirectToDistribution( id: number ): void {
    this.router.navigate( [ `/crm/profile-distribution/${id}` ] );
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












