import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { timer } from 'rxjs/observable/timer';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { takeWhile } from 'rxjs/operators';
import { ISegmentation } from '../../../interface/isegmentation';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as R from 'ramda';
import { detailExpand } from '../../../animations/animations';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component( {
  selector: 'app-table-example-segmentation',
  templateUrl: './table-example-segmentation.component.html',
  styleUrls: [ './table-example-segmentation.component.styl' ],
  animations: [ detailExpand ],
} )
export class TableExampleSegmentationComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<any>;
  public isCp: boolean = false;
  public selection = new SelectionModel<any>( true, [] );
  public isDisabled: boolean;
  public expandedElement: ISegmentation | null;
  public formFilterSegmentation: FormGroup;



  @Input() private tableDataSource: ISegmentation[];
  @Output() private emitSegmentationId = new EventEmitter<number>();

  @ViewChild( MatSort, { static: true } ) sort: MatSort;
  @ViewChild( MatPaginator, { static: true } ) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.initDataSource();
    this.initDisplayedColumns();
    this.initFormCheckbox();
    this.initSwitchSegmentation();
  }

  private initFormCheckbox() {
    this.formFilterSegmentation = this.fb.group( {
      whichSegmentation: 'all'
    } );
  }

  private initDisplayedColumns() {
    this.displayedColumns = [
      'select',
      'title',
      'isComplex',
      'segmentationGranularity',
      'segmentationId',
    ];
  }

  private initSwitchSegmentation() {
    const isComplex = segmentation => segmentation.isComplex;
    const segmentationSimple = R.reject( isComplex );
    const segmentationComplicated = R.filter( isComplex );
    const success = ( { whichSegmentation } ) => {
      switch ( whichSegmentation ) {
        case 'all':
          this.dataSourceFun( this.tableDataSource );
          break;
        case 'simple':
          this.dataSourceFun( segmentationSimple( this.tableDataSource ) );
          break;
        case 'complicated':
          this.dataSourceFun( segmentationComplicated( this.tableDataSource ) );
          break;
      }
    };

    this.formFilterSegmentation.valueChanges
      .pipe( untilDestroyed(this) )
      .subscribe( success );
  }

  private initDataSource() {
    this.dataSourceFun( this.tableDataSource );
  }

  private dataSourceFun( params ) {
    this.dataSource = new MatTableDataSource( params );
    timer( 1 )
      .pipe( untilDestroyed(this) )
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
      this.windowDialog( `DIALOG.DELETE.SEGMENTATIONS`, 'delete', params, 'deleteSegmentations' );
    }
  }

  redirectToSegmentation( segmentationId: number ): void {
    this.emitSegmentationId.emit( segmentationId );
  }

  disabledCheckbox( eventData ): void {
    this.isDisabled = eventData;
  }

  ngOnDestroy(): void {}

}












