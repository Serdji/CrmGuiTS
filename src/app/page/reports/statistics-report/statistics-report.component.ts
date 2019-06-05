import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { config, timer } from 'rxjs';

import { person } from './person';
import { StatisticsReportService } from './statistics-report.service';
import { map, takeWhile, tap } from 'rxjs/operators';
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
    this.initTemplates();
  }


  private initTemplates() {
    const TREE_DATA: FoodNode[] = [];
    const propName = R.prop( 'name' );
    const uniqByName = R.uniqBy( propName );
    const composeUnnestConfig = R.compose( R.unnest, R.last );

    const funcMapPathConversion = template => {
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

    const mapRemoveRepetitions = templates => {
      const unnestConfig = composeUnnestConfig( templates );
      const uniqByConfig = uniqByName( unnestConfig );
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

    const success = templates => console.log( templates );

    this.statisticsReportService.getTemplates()
      .pipe(
        takeWhile( _ => this.isActive ),
        map( mapPathConversion ),
        map( mapRemoveRepetitions )
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
