import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StatisticsReportService } from './statistics-report.service';
import { map, takeWhile, tap } from 'rxjs/operators';
import * as R from 'ramda';
import { saveAs } from 'file-saver';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material';
import { IParamsDynamicForm } from '../../../interface/iparams-dynamic-form';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { logger } from 'codelyzer/util/logger';


interface FoodNode {
  name: string;
  children?: FoodNode[];
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
  public paramsDynamicForm: IParamsDynamicForm[];
  public isDynamicForm: boolean;

  public pdfSrc: string;
  public pageVariable: number;
  public pageLength: number;
  public buttonPreviousDisabled: boolean;
  public buttonNextDisabled: boolean;

  private patternPath: string;
  private blob: Blob;

  @ViewChild( 'stepper' ) stepper;

  constructor(
    private fb: FormBuilder,
    private statisticsReportService: StatisticsReportService
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.initTemplates();
    this.isProgressTemplates = true;
    this.isProgressPdfViewer = false;
    this.isDynamicForm = false;

    this.pageVariable = 1;
    this.buttonPreviousDisabled = true;
    this.buttonNextDisabled = false;
  }


  private initTemplates() {
    const TREE_DATA: FoodNode[] = [];
    const propName = R.prop( 'name' );
    const uniqByName = R.uniqBy( propName );
    const composeUnnestConfig = R.compose( R.unnest, R.last );

    // Мапируем массив из строк во вложенную структуру
    const funcMapPathConversion = ( template: string ): FoodNode[] => {
      // Рекурсивная функция для структурирования вложенностей
      // @ts-ignore
      const funcRecurConfig = ( splitDrop, configTreeData = [], children = [], i = 1 ) => {
        if ( !R.isNil( splitDrop[ 0 ] ) )
          children.push( {
            level: i,
            name: splitDrop[ 0 ],
            children: []
          } );
        configTreeData.push( children );
        if ( !R.isEmpty( splitDrop ) ) funcRecurConfig( R.tail( splitDrop ), configTreeData, children[ 0 ].children, ++i );
        return configTreeData;
      };
      const composeTreeDataSplitDrop = R.compose(
        R.filter( R.propEq( 'level', 1 ) ),
        R.unnest,
        funcRecurConfig,
        R.append( template ),
        R.dropLast( 1 ),
        // @ts-ignore
        R.split( '/' )
      );
      // @ts-ignore
      TREE_DATA.push( composeTreeDataSplitDrop( template ) );
      return R.unnest( TREE_DATA );
    };
    const mapPathConversion = R.map( funcMapPathConversion );

    // Маппинг для уделения повторений и проверки вложанностей структуры каталогов
    const mapRemoveRepetitions = ( templates: any ): FoodNode[] => {
      const unnestConfig = composeUnnestConfig( templates );
      const uniqByConfig = uniqByName( unnestConfig );

      // Рекурсия для прохода по не определленной глубене вложанности дерева
      const funcRecurRecDist = ( uniqByCon, unnestCon ) => {
        const mapUniqByConfig = R.map( ( receiver: any ) => {
          const mapUnnestConfig = R.map( ( distributor: any ) => {
            if ( !R.isNil( receiver.children[ 0 ] ) ) {
              if ( receiver.name === distributor.name ) receiver.children.push( distributor.children[ 0 ] );
              if ( !R.isEmpty( receiver.children ) ) funcRecurRecDist( receiver.children, receiver.children );
            }
          } );
          mapUnnestConfig( unnestCon );
          if ( !R.isEmpty( receiver.children ) ) {
            receiver.children = uniqByName( receiver.children );
            return receiver;
          }
        } );
        return mapUniqByConfig( uniqByCon );
      };
      return funcRecurRecDist( uniqByConfig, unnestConfig );
    };

    const success = templates => {
      this.dataSource.data = templates;
      this.isProgressTemplates = false;
    };

    this.statisticsReportService.getTemplates()
      .pipe(
        takeWhile( _ => this.isActive ),
        map( mapPathConversion ),
        map( mapRemoveRepetitions )
      )
      .subscribe( success );
  }

  private buttonIsDisabled() {
    this.buttonPreviousDisabled = this.pageVariable <= 1;
    this.buttonNextDisabled = this.pageVariable >= this.pageLength;
  }

  onSendTemplate( patternPath: string ): void {
    this.patternPath = patternPath;
    this.isDynamicForm = false;
    this.statisticsReportService.getParamsDynamicForm( patternPath )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( paramsDynamicForm => {
        if ( !R.isEmpty( paramsDynamicForm ) ) {
          this.paramsDynamicForm = paramsDynamicForm;
          this.isDynamicForm = true;
          this.stepper.next();
        } else {
          this.onDynamicFormValue( {} );
        }
      } );
  }

  onDynamicFormValue( event ): void {
    this.isProgressPdfViewer = true;
    const params = {
      ReportName: this.patternPath,
      ReportParameters: event,
    };
    this.statisticsReportService.getParams( params )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( resp => {
        this.blob = resp.body;
        if ( typeof ( FileReader ) !== 'undefined' ) {
          const reader = new FileReader();
          reader.readAsArrayBuffer( resp.body );
          reader.onload = ( e: any ) => {
            this.pdfSrc = e.target.result;
            this.isProgressPdfViewer = false;
          };
        }
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

  onDownloadPDF() {
    saveAs( this.blob, 'Отчет' );
  }


  hasChild = ( _: number, node: FoodNode ) => !!node.children && node.children.length > 0;

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
