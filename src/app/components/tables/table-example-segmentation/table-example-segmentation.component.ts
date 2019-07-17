import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
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
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PeriodicElement } from '../table-example-distribution/table-example-distribution.component';
import { ISegmentation } from '../../../interface/isegmentation';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as R from 'ramda';

@Component( {
  selector: 'app-table-example-segmentation',
  templateUrl: './table-example-segmentation.component.html',
  styleUrls: [ './table-example-segmentation.component.styl' ],
  animations: [
    trigger( 'detailExpand', [
      state( 'collapsed', style( { height: '0px', minHeight: '0', display: 'none', borderColor: 'rgba(0,0,0,0)' } ) ),
      state( 'expanded', style( { height: '*' } ) ),
      transition( 'expanded <=> collapsed', animate( '225ms cubic-bezier(0.4, 0.0, 0.2, 1)' ) ),
    ] ),
  ],
} )
export class TableExampleSegmentationComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<any>;
  public isCp: boolean = false;
  public selection = new SelectionModel<any>( true, [] );
  public isDisabled: boolean;
  public expandedElement: ISegmentation | null;
  public formFilterSegmentation: FormGroup;

  private isActive: boolean;

  @Input() private tableDataSource: ISegmentation[];
  @Output() private emitSegmentationId = new EventEmitter<number>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
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
      'segmentationId',
    ];
  }

  private initSwitchSegmentation() {
    const isComplex = segmentation => segmentation.isComplex;
    const segmentationSimple = R.reject( isComplex );
    const segmentationComplicated = R.filter( isComplex );
    const success = ( { whichSegmentation } ) => {
      switch ( whichSegmentation ) {
        case 'all': this.dataSourceFun( this.tableDataSource ); break;
        case 'simple': this.dataSourceFun( segmentationSimple( this.tableDataSource ) ); break;
        case 'complicated': this.dataSourceFun( segmentationComplicated( this.tableDataSource ) ); break;
      }
    };

    this.formFilterSegmentation.valueChanges
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( success );
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
      this.windowDialog( `Вы действительно хотите удалить ${arrayId.length === 1 ? 'группу сегментации' : 'группы сегментации'} ?`, 'delete', params, 'deleteSegmentations' );
    }
  }

  redirectToSegmentation( segmentationId: number ): void {
    this.emitSegmentationId.emit( segmentationId );
  }

  disabledCheckbox( eventData ): void {
    this.isDisabled = eventData;
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}












