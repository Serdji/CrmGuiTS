import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from '@angular/material';
import { timer } from 'rxjs/observable/timer';
import { SelectionModel } from '@angular/cdk/collections';
import { takeWhile } from 'rxjs/operators';
import { DialogComponent } from '../../../shared/dialog/dialog.component';

@Component( {
  selector: 'app-table-example-profile-group',
  templateUrl: './table-example-profile-group.component.html',
  styleUrls: [ './table-example-profile-group.component.styl' ],
} )
export class TableExampleProfileGroupComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<any>;
  public selection = new SelectionModel<any>( true, [] );
  private isActive: boolean;
  public isDisabled: boolean;
  public ids: any;

  @Input() private tableDataSource: any;

  @ViewChild( MatSort ) sort: MatSort;
  @ViewChild( MatPaginator ) paginator: MatPaginator;

  constructor( private dialog: MatDialog ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.initDataSource();
    this.initDisplayedColumns();
  }

  private initDisplayedColumns() {
    this.displayedColumns = [
      'select',
      'customerGroupName',
      'customerGroupId',
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

  deleteProfileGroups(): void {
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
      this.windowDialog( `Вы действительно хотите удалить ${ arrayId.length === 1 ? 'группу пассажиров' : 'группы пассажиров' } ?`, 'delete', params, 'deleteProfileGroups' );
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
      this.ids = { customerGroupIds: arrayId };
    }
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}












