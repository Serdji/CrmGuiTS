import { Component, Input, OnInit, ViewChild } from '@angular/core';
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

@Component( {
  selector: 'app-table-async-profile',
  templateUrl: './table-async-profile.component.html',
  styleUrls: [ './table-async-profile.component.styl' ],
} )
export class TableAsyncProfileComponent implements OnInit {

  public displayedColumns: string[] = [
    'select',
    'firstName',
    'lastName',
    'middleName',
    'prefix',
    'gender',
    'dob',
    'idCustomer'
  ];


  public dataSource: MatTableDataSource<any>;
  public isCp: boolean = false;
  public resultsLength: number;
  public isLoadingResults: boolean = false;
  public selection = new SelectionModel<PeriodicElement>(true, []);

  @Input() private tableDataSource: any;

  @ViewChild( MatSort ) sort: MatSort;
  @ViewChild( MatPaginator ) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private tableAsyncProfileService: TableAsyncProfileService,
  ) { }

  ngOnInit(): void {
    this.ititHeaderTable();
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
      this.dialog.open( DialogComponent, {
        data: {
          message: text,
          status: 'text',
        },
      } );
    }
  }

  private ititHeaderTable() {

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

  private isChildMore( parentElement ): boolean {
    const getElemCss = getComputedStyle( parentElement );
    const parentWidth = parentElement.offsetWidth - parseInt( getElemCss.paddingRight +  getElemCss.paddingLeft, 10 );
    const childrenWidth = parentElement.firstElementChild.offsetWidth;
    return childrenWidth > parentWidth;

  }

  isAllSelected(): void {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

}
