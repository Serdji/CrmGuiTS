import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StatisticsReportService } from './statistics-report.service';
import { map, takeWhile } from 'rxjs/operators';
import * as R from 'ramda';
import { saveAs } from 'file-saver';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { IParamsDynamicForm } from '../../../interface/iparams-dynamic-form';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { combineLatest } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';
import { TitleService } from '../../../services/title.service';


interface FoodNode {
  name: string;
  children?: FoodNode[];
}

interface BlobFile {
  blob: Blob;
  fileName: any;
}


@Component( {
  selector: 'app-distribution-report',
  templateUrl: './statistics-report.component.html',
  styleUrls: [ './statistics-report.component.styl' ],
} )
export class StatisticsReportComponent implements OnInit, OnDestroy {

  treeControl = new NestedTreeControl<FoodNode>( node => node.children );
  dataSource = new MatTreeNestedDataSource<FoodNode>();

  private isActive: boolean;

  public dynamicForm: FormGroup;
  public person: any;
  public templates: FoodNode[];
  public isProgressTemplates: boolean;
  public isProgressPdfViewer: boolean;
  public isProgressDynamicForm: boolean;
  public paramsDynamicForm: IParamsDynamicForm[];
  public isDynamicForm: boolean;

  public pdfSrc: string;
  public pageVariable: number;
  public pageLength: number;
  public buttonPreviousDisabled: boolean;
  public buttonNextDisabled: boolean;

  private patternPath: string;
  private file: { pdf: BlobFile };

  @ViewChild('stepper', { static: true }) stepper;

  constructor(
    private fb: FormBuilder,
    private statisticsReportService: StatisticsReportService,
    private titleService: TitleService
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.isProgressTemplates = true;
    this.isProgressPdfViewer = false;
    this.isProgressDynamicForm = false;
    this.isDynamicForm = false;

    this.pageVariable = 1;
    this.buttonPreviousDisabled = true;
    this.buttonNextDisabled = false;
  }



  private buttonIsDisabled() {
    this.buttonPreviousDisabled = this.pageVariable <= 1;
    this.buttonNextDisabled = this.pageVariable >= this.pageLength;
  }

  onSendTemplate( patternPath: string ): void {
    this.patternPath = patternPath;
    this.isProgressDynamicForm = true;
    this.isDynamicForm = false;
    this.stepper.next();

    const success = paramsDynamicForm => {
      if ( !R.isEmpty( paramsDynamicForm ) ) {
        this.paramsDynamicForm = paramsDynamicForm;
        this.isProgressDynamicForm = false;
        this.isDynamicForm = true;
      } else {
        this.onReportGeneration( {} );
        this.isProgressDynamicForm = false;
        this.isDynamicForm = false;
      }
    };
    const error = _ => {
      this.isProgressDynamicForm = false;
      this.isDynamicForm = false;
    };

    this.statisticsReportService.getParamsDynamicForm( patternPath )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( success, error );

  }

  onReportGeneration( event ): void {
    const reportTypeLens = R.lensProp( 'ReportType' );
    this.pageVariable = 1;
    this.isProgressPdfViewer = true;
    const params = {
      ReportName: this.patternPath,
      ReportParameters: event,
    };
    // @ts-ignore
    const composeSplitFileName = R.compose( R.last, R.split( '/' ) );
    const fileNameSplit = R.compose(
      R.nth( -2 ),
      R.split( '.' ),
      R.nth( 1 ),
      R.split( '=' ),
      R.nth( 1 ),
      R.split( ';' ),
    );

    const oPdf = this.statisticsReportService.getParams( R.set( reportTypeLens, 'pdf', params ) ).pipe( takeWhile( _ => this.isActive ) );
    const oWord = this.statisticsReportService.getParams( R.set( reportTypeLens, 'word', params ) ).pipe( takeWhile( _ => this.isActive ) );
    const oExcel = this.statisticsReportService.getParams( R.set( reportTypeLens, 'excel', params ) ).pipe( takeWhile( _ => this.isActive ) );

    const getObservablesFiles = combineLatest( oPdf, oWord, oExcel  );
    getObservablesFiles.subscribe( ( respArr: any[] ) => {
      _.each( respArr, ( resp, index ) => {
        const blob = resp.body;
        // const fileName = fileNameSplit( resp.headers.get( 'content-disposition' ) );
        const fileName = composeSplitFileName( this.patternPath );
        const creatureFile = expansion => this.file = R.merge( this.file, { [expansion]: { blob, fileName } } );
        switch ( index ) {
          case 0:
            creatureFile( 'pdf' );
            if ( typeof ( FileReader ) !== 'undefined' ) {
              const reader = new FileReader();
              reader.readAsArrayBuffer( resp.body );
              reader.onload = ( e: any ) => {
                this.pdfSrc = e.target.result;
                this.isProgressPdfViewer = false;
              };
            }
            break;
          case 1: creatureFile( 'doc' ); break;
          case 2: creatureFile( 'xls' ); break;
        }
      } );
      this.titleService.title = this.file.pdf.fileName;
    } );
  }

  afterLoadComplete( pdf: PDFDocumentProxy ) {
    this.pageLength = pdf.numPages;
    this.buttonIsDisabled();
  }

  onIncrementPage( amount: number ): void {
    this.pageVariable += amount;
    this.buttonIsDisabled();
  }

  onDownloadPDF( expansion: string ) {
    const date = moment( ).format( 'DD.MM.YYYY_HH.mm' );
    saveAs( this.file[expansion].blob, `${this.file[expansion].fileName}_${date}.${expansion}` );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
