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
import { IpagPage } from '../../../interface/ipag-page';
import { TabletAsyncPromotionsService } from './tablet-async-promotions.service';

@Component( {
  selector: 'app-tablet-async-promotions',
  templateUrl: './tablet-async-promotions.component.html',
  styleUrls: [ './tablet-async-promotions.component.styl' ],
} )
export class TabletAsyncPromotionsComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<any>;
  public isCp: boolean = false;
  public selection = new SelectionModel<any>( true, [] );
  public isDisabled: boolean;
  public resultsLength: number;
  public isLoadingResults: boolean = false;
  public totalCount: number;
  public ids: any;

  private isActive: boolean;


  @Input() private tableDataSource: any;

  @ViewChild( MatSort ) sort: MatSort;
  @ViewChild( MatPaginator ) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private tabletAsyncPromotionsService: TabletAsyncPromotionsService
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.initDataSource();
    this.initDataSourceAsync();
    this.initPaginator();
    this.initDisplayedColumns();
  }

  private initDisplayedColumns() {
    this.displayedColumns = [
      'select',
      'promotionName',
      'promotionId'
    ];
  }

  private initDataSource() {
    this.dataSourceFun( this.tableDataSource );
  }

  private initPaginator() {
    this.resultsLength = this.tabletAsyncPromotionsService.countPage;
    this.totalCount = this.tabletAsyncPromotionsService.countPage;
    this.paginator.page
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: IpagPage ) => {
        this.tabletAsyncPromotionsService.setPagPage( value );
        this.isLoadingResults = true;
      } );
  }

  private initDataSourceAsync() {
    this.tabletAsyncPromotionsService.subjectTableDataSource
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: any ) => {
        this.dataSourceFun( value );
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

  editCreate( promotionsId: number, promotionsName: string ): void {
    this.windowDialog( ``, 'updatePromotions', { promotionsId, promotionsName }, 'updatePromotions' );
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
      this.windowDialog( `Вы действительно хотите удалить ${ arrayId.length === 1 ? 'промоакцию' : 'промоакции' } ?`, 'delete', params, 'deletePromotions' );
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












