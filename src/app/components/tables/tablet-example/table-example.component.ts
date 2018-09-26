import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from '@angular/material';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { timer } from 'rxjs/observable/timer';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';

@Component( {
  selector: 'app-table-example',
  templateUrl: './table-example.component.html',
  styleUrls: [ './table-example.component.styl' ],
} )
export class TableExampleComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<any>;
  public isCp: boolean = false;

  private isActive: boolean;

  @Input() public tableHeader: string[];
  @Input() private tableDataSource: any;

  @ViewChild( MatSort ) sort: MatSort;
  @ViewChild( MatPaginator ) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.initDisplayedColumns();
    this.initDataSource();
  }

  private initDisplayedColumns() {
    for ( const header of this.tableHeader ) {
      this.displayedColumns.push( header[ 0 ] );
    }
  }

  private initDataSource() {
    this.dataSource = new MatTableDataSource( this.tableDataSource );
    timer( 1 )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
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
      this.dialog.open( DialogComponent, {
        data: {
          message: text,
          status: 'text',
        },
      } );
    }
  }

  applyFilter( filterValue: string ): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  redirectToUser( event: any ): void {
    if ( this.isCp ) return;
    const id = event.currentTarget.getAttribute( 'id' );
    this.router.navigate( [ `/crm/user/${id}` ] );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
