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

@Component( {
  selector: 'app-table-example-profile-names',
  templateUrl: './table-example-profile-names.component.html',
  styleUrls: [ './table-example-profile-names.component.styl' ],
} )
export class TableExampleProfileNamesComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<any>;
  public isCp: boolean = false;
  public selection = new SelectionModel<any>( true, [] );
  public isDisabled: boolean;

  private isActive: boolean;

  @Input() private tableDataSource: any;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

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
      'firstName',
      'lastName',
      'secondName',
      'customerNameId',
    ];
  }

  private initDataSource() {
    this.tableDataSource = this.tableDataSource.filter( value => value.customerNameType !== 1 );
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

  editCreate( customerId, customerNameId, customerNameType, firstName, lastName, secondName ): void {
    const fioObj = { firstName, lastName, secondName };
    this.windowDialog( ``, 'updateProfileName',  { customerId, customerNameId, customerNameType, fioObj } , 'profileName' );
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

  deleteCustomerNames(): void {
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
      this.windowDialog( `DIALOG.DELETE.FIO`, 'delete', params, 'profileNames' );
    }
  }

  disabledCheckbox( eventData ): void {
    this.isDisabled = eventData;
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}












