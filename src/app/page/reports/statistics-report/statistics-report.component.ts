import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { timer } from 'rxjs';

import { person } from './person';
import { StatisticsReportService } from './statistics-report.service';
import { takeWhile } from 'rxjs/operators';
import * as R from 'ramda';


@Component( {
  selector: 'app-distribution-report',
  templateUrl: './statistics-report.component.html',
  styleUrls: [ './statistics-report.component.styl' ],
} )
export class StatisticsReportComponent implements OnInit, OnDestroy {

  private isActive: boolean;
  private dynamicFormValue: any;

  public templateForm: FormGroup;
  public dynamicForm: FormGroup;
  public person: any;
  public templates: string[];

  @ViewChild( 'stepper' ) stepper;

  constructor(
    private fb: FormBuilder,
    private statisticsReportService: StatisticsReportService
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.initTemplateForm();
    this.initTemplates();
  }

  private initTemplateForm() {
    this.templateForm = this.fb.group( {
      template: [ '' ]
    } );
  }

  private initTemplates() {

    const funcMapTemplates = template => {
      let config: { dir: string[], temp: string }  ;
      const dir: string[] = [];
      let temp: string;

      const split = R.split( '/' );
      const dropLast = R.dropLast( 1 );
      const append = R.append( template );
      // @ts-ignore
      const composeSplitDrop = R.compose( append, dropLast, split );
      const lengthTemplate = R.length( composeSplitDrop( template ) );

      const funcEachConfig = ( splitDropTemplate, index ) => {
        const i = +index + 1;
        if ( i !== lengthTemplate ) dir.push( splitDropTemplate );
        else temp = splitDropTemplate;
        config = {
          dir,
          temp
        };
      };
      const eachConfig = R.forEachObjIndexed( funcEachConfig );
      eachConfig( composeSplitDrop( template ) );

      return config;
    };

    const mapTemplates = R.map( funcMapTemplates );

    const success = templates => {
      this.templates = templates;
      console.log(mapTemplates( templates ));

    };

    this.statisticsReportService.getTemplates()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( success );
  }

  stepperNext(): void {
    timer( 100 ).subscribe( _ => {
      this.person = person;
      this.stepper.next();
    } );
  }

  onDynamicFormValue( data ): void {
    this.dynamicFormValue = data;
  }

  resultForm(): void {
    console.log( this.dynamicFormValue );
    this.stepper.next();
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
