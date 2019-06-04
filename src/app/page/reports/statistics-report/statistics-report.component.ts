import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { config, timer } from 'rxjs';

import { person } from './person';
import { StatisticsReportService } from './statistics-report.service';
import { map, takeWhile } from 'rxjs/operators';
import * as R from 'ramda';


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

  private isActive: boolean;
  private dynamicFormValue: any;

  public templateForm: FormGroup;
  public dynamicForm: FormGroup;
  public person: any;
  public templates: FoodNode[];

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
    const TREE_DATA: FoodNode[] = [];
    const funcMapTemplates = template => {
      // @ts-ignore
      const composeSplitDrop = R.compose( R.append( template ), R.dropLast( 1 ), R.split( '/' ) );

      const funcConfig = ( splitDrop, config = [], children = [], i = 1 ) => {
        if ( !R.isNil( splitDrop[ 0 ] ) )
          children.push( {
            level: i,
            name: splitDrop[ 0 ],
            children: []
          } );
        config.push( children );
        if ( !R.isEmpty( splitDrop ) ) funcConfig( R.tail( splitDrop ), config, children[ 0 ].children, ++i );
        return config;
      };

      const composeTreeData = R.compose( R.filter( R.propEq( 'level', 1 ) ), R.unnest, funcConfig );
      // @ts-ignore
      TREE_DATA.push( composeTreeData( composeSplitDrop( template ) ) );
      return R.unnest( TREE_DATA );
    };

    const mapTemplates = R.map( funcMapTemplates );
    const composeUnnestConfig = R.compose( R.unnest, R.last );

    const success = templates => {
      const lensChildren = R.lensProp( 'children' );
      const propName = R.prop( 'name' );
      const unnestConfig = composeUnnestConfig( templates );
      const uniqByName = R.uniqBy( propName );
      const uniqByConfig = uniqByName( unnestConfig );

      // console.log( unnestConfig );
      // console.log( uniqByConfig );

      const funcUniqByConfig = ( uniqByCon, unnestCon, i = 1 ) => {

        const mapUniqByConfig = R.map( ( uniqByConf: any ) => {


          const mapUnnestConfig = R.map( ( unnestConf: any ) => {

            if ( uniqByConf.name === unnestConf.name ) uniqByConf.children.push( unnestConf.children[ 0 ] );
            funcUniqByConfig( uniqByConf.children, unnestConf.children[ 0 ], ++i );
          } );

          mapUnnestConfig( unnestCon );

          return R.set( lensChildren, uniqByName( uniqByConf.children ), uniqByConf );
        } );

        return mapUniqByConfig( uniqByCon );
      };

      console.log( funcUniqByConfig( uniqByConfig, unnestConfig ) );
    };

    this.statisticsReportService.getTemplates()
      .pipe(
        takeWhile( _ => this.isActive ),
        map( mapTemplates )
      )
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
