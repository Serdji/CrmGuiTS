import { Component, Input, OnInit, ViewChild } from '@angular/core';
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

@Component( {
  selector: 'app-tablet-example-profile-names',
  templateUrl: './tablet-example-profile-names.component.html',
  styleUrls: [ './tablet-example-profile-names.component.styl' ],
} )
export class TabletExampleProfileNamesComponent implements OnInit {

  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<any>;
  public isCp: boolean = false;
  public selection = new SelectionModel<any>( true, [] );
  public isDisabled: boolean;

  @Input() private tableDataSource: any;

  @ViewChild( MatSort ) sort: MatSort;
  @ViewChild( MatPaginator ) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initDataSource();
    this.initDisplayedColumns();
  }

  private initDisplayedColumns() {
    this.displayedColumns = [
      'select',
      'firstName',
      'lastName',
      'secondName',
      'contactId',
    ];
  }

  private initDataSource() {
    this.dataSourceFun( this.tableDataSource );
  }

  private dataSourceFun( params ) {
    console.log(params);
    this.dataSource = new MatTableDataSource( params );
    timer( 1 ).subscribe( _ => {
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

  editCreate( customerId, customerNameId, customerNameType ): void {
    console.log(customerId, customerNameId, customerNameType );
    // this.windowDialog( ``, 'update',  { typeCode, typeId, contactId, customerId, text} , 'contact' );
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

  deleteContact(): void {
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
      console.log( params );
      this.windowDialog( `Вы действительно хотите удаль ${ arrayId.length === 1 ? 'этот контакт' : 'эти контакты' } ?`, 'delete', params, 'contacts' );
    }
  }

  disabledCheckbox( eventData ): void {
    this.isDisabled = eventData;
  }

}












