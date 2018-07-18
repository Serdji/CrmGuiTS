import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from '@angular/material';
import { timer } from 'rxjs/observable/timer';
import { TableAsyncProfileService } from './table-async-profile.service';
import { IpagPage } from '../../interface/ipag-page';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';

@Component( {
  selector: 'app-table-async-profile',
  templateUrl: './table-async-profile.component.html',
  styleUrls: [ './table-async-profile.component.styl' ],
} )
export class TableAsyncProfileComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = [
    'select',
    'firstName',
    'lastName',
    'middleName',
    'prefix',
    'gender',
    'dob',
    'customerId',
  ];


  public dataSource: MatTableDataSource<any>;
  public isCp: boolean = false;
  public resultsLength: number;
  public isLoadingResults: boolean = false;
  public selection = new SelectionModel<any>( true, [] );

  private isActive: boolean = true;

  @Input() private tableDataSource: any;

  @ViewChild( MatSort ) sort: MatSort;
  @ViewChild( MatPaginator ) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private tableAsyncProfileService: TableAsyncProfileService,
    private router: Router,
  ) { }

  ngOnInit(): void {
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
      this.windowDialog( text, 'text' );
    }
  }


  private initPaginator() {
    this.resultsLength = this.tableAsyncProfileService.countPage;
    this.paginator.page.subscribe( ( value: IpagPage ) => {
      this.tableAsyncProfileService.setPagPage( value );
      this.isLoadingResults = true;
    } );
  }


  private initDataSourceAsync() {
    this.tableAsyncProfileService.subjectTableDataSource.subscribe( ( value: any ) => {
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
    const parentWidth = parentElement.offsetWidth - parseInt( getElemCss.paddingRight, 10) - parseInt( getElemCss.paddingLeft, 10);
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
      this.windowDialog( `Вы действительно хотите удаль эти ${ arrayId.length === 1 ? 'профиль' : 'профили' } ?`, 'delete', params,'profiles' );
    }
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
