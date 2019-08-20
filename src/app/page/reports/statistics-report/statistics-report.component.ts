import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StatisticsReportService } from './statistics-report.service';
import { map, takeWhile } from 'rxjs/operators';
import * as R from 'ramda';
import { saveAs } from 'file-saver';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material';
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
  public isProgressButton: boolean;
  public paramsDynamicForm: IParamsDynamicForm[];
  public isDynamicForm: boolean;

  public pdfSrc: string;
  public pageVariable: number;
  public pageLength: number;
  public buttonPreviousDisabled: boolean;
  public buttonNextDisabled: boolean;

  private patternPath: string;
  private file: { pdf: BlobFile };
  private paramsEvent: any;
  private reportTypeLens = R.lensProp( 'ReportType' );

  @ViewChild( 'stepper' ) stepper;

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
    this.isProgressButton = false;
    this.pageVariable = 1;
    this.buttonPreviousDisabled = true;
    this.buttonNextDisabled = false;
  }


  private buttonPaginatorIsDisabled() {
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

  // @ts-ignore
  composeSplitFileName = R.compose( R.last, R.split( '/' ) );
  blob = resp => resp.body;
  fileName = patternPath => this.composeSplitFileName( patternPath );
  generationFile = ( expansion, resp, patternPath ) => this.file =  R.merge( this.file, { [ expansion ]: { blob: this.blob( resp ), fileName: this.fileName( patternPath ) } } );

  onReportGeneration( event ): void {
    this.pageVariable = 1;
    this.isProgressPdfViewer = true;
    this.paramsEvent = {
      ReportName: this.patternPath,
      ReportParameters: event,
    };

    this.statisticsReportService.getParams( R.set( this.reportTypeLens, 'pdf', this.paramsEvent ) )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( resp => {
        this.generationFile( 'pdf', resp, this.patternPath );
        if ( typeof ( FileReader ) !== 'undefined' ) {
          const reader = new FileReader();
          reader.readAsArrayBuffer( resp.body );
          reader.onload = ( e: any ) => {
            this.pdfSrc = e.target.result;
            this.isProgressPdfViewer = false;
          };
        }
        this.titleService.title = this.file.pdf.fileName;
      } );
  }

  afterLoadComplete( pdf: PDFDocumentProxy ) {
    this.pageLength = pdf.numPages;
    this.buttonPaginatorIsDisabled();
  }

  onIncrementPage( amount: number ): void {
    this.pageVariable += amount;
    this.buttonPaginatorIsDisabled();
  }

  onDownloadPDF( expansion: string ) {
    this.isProgressButton = true;
    // @ts-ignore
    const date = moment().format( 'DD.MM.YYYY_HH.mm' );
    const success = resp => {
      this.generationFile( expansion, resp, this.patternPath );
      saveAs( this.file[ expansion ].blob, `${this.file[ expansion ].fileName}_${date}.${expansion}` );
      this.isProgressButton = false;
    };

    switch ( expansion ) {
      case 'pdf':
        saveAs( this.file[ expansion ].blob, `${this.file[ expansion ].fileName}_${date}.${expansion}` );
        this.isProgressButton = false;
        break;
      case 'doc':
        this.statisticsReportService.getParams( R.set( this.reportTypeLens, 'word', this.paramsEvent ) )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( success );
          break;
      case 'xls':
        this.statisticsReportService.getParams( R.set( this.reportTypeLens, 'excel', this.paramsEvent ) )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( success );
          break;
    }
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
