import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { timer } from 'rxjs';

import { person } from './person';
import * as R from 'ramda';
import * as moment from 'moment';


@Component( {
  selector: 'app-distribution-report',
  templateUrl: './distribution-report.component.html',
  styleUrls: [ './distribution-report.component.styl' ],
} )
export class DistributionReportComponent implements OnInit, OnDestroy {

  private isActive: boolean;

  public templateForm: FormGroup;
  public dynamicForm: FormGroup;
  public objectProps: any;

  @ViewChild( 'stepper' ) stepper;

  constructor( private fb: FormBuilder ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.initTemplateForm();
    this.initDynamicForm();
  }

  private initTemplateForm() {
    this.templateForm = this.fb.group( {
      template: [ '', Validators.required ]
    } );
  }

  private mapValidators( validators ) {
    const formValidators = [];
    const mapValidationFunc = validation => {
      switch ( validation ) {
        case 'required': formValidators.push( Validators.required ); break;
        case 'min': formValidators.push( Validators.min( validators[ validation ] ) ); break;
      }
    };
    const mapValidation = R.map( mapValidationFunc );
    const composeValidation = R.compose( mapValidation, R.keys );

    if ( validators ) composeValidation( validators );
    return formValidators;
  }

  private initDynamicForm() {
    const objMerge = prop => R.merge( { key: prop }, person[ prop ] );
    const mapKeys = R.map( objMerge );
    const composeObjProps = R.compose( mapKeys, R.keys );
    this.objectProps = composeObjProps( person );

    const formGroup = {};
    const formControls = prop => new FormControl(
      R.view( R.lensPath( [ prop, 'value' ] ), person ) || '',
      this.mapValidators( R.view( R.lensPath( [ prop, 'validation' ] ), person ) )
    );
    const setFormGroup = prop => formGroup[ prop ] = formControls( prop );
    const mapPerson = R.map( setFormGroup );
    const composeFormControl = R.compose( mapPerson, R.keys );

    composeFormControl( person );
    this.dynamicForm = new FormGroup( formGroup );
  }


  stepperNext(): void {
    timer( 100 ).subscribe( _ => this.stepper.next() );
  }

  sendForm(): void {
    const objParserDara = {};
    const generateNewObj = R.curry(( obj, value, key ) => obj[ key ] = moment.isMoment( value ) ? moment( value ).format( 'YYYY-MM-DD' ) : value);
    const momentFunc = generateNewObj( objParserDara );
    const parserData = R.forEachObjIndexed( momentFunc );
    parserData( this.dynamicForm.value );

    console.log( objParserDara );

    this.stepper.next();
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
