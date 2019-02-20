import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as R from 'ramda';
import * as moment from 'moment';
import { map, takeWhile } from 'rxjs/operators';

@Component( {
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: [ './dynamic-form.component.styl' ]
} )
export class DynamicFormComponent implements OnInit, OnDestroy {

  public dynamicForm: FormGroup;
  public objectProps: any;
  public splitObjectProps: any;

  private isActive: boolean;

  @Input() dataObject: any;
  @Input() splitInput: number;
  @Output() dynamicFormEmit: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    this.isActive = true;
    this.initDynamicForm();
    this.initDynamicFormEmit();
    this.initSplitObjectProps();
  }

  private mapValidators( validators ) {
    const formValidators = [];
    const mapValidationFunc = validation => {
      switch ( validation ) {
        case 'required':
          formValidators.push( Validators.required );
          break;
        case 'max':
          formValidators.push( Validators.max( validators[ validation ] ) );
          break;
        case 'min':
          formValidators.push( Validators.min( validators[ validation ] ) );
          break;
        case 'email':
          formValidators.push( Validators.email );
          break;
      }
    };
    const mapValidation = R.map( mapValidationFunc );
    const composeValidation = R.compose( mapValidation, R.keys );

    if ( validators ) composeValidation( validators );
    return formValidators;
  }

  private initDynamicForm() {
    const objMerge = prop => R.merge( { key: prop }, this.dataObject[ prop ] );
    const mapKeys = R.map( objMerge );
    const composeObjProps = R.compose( mapKeys, R.keys );
    this.objectProps = composeObjProps( this.dataObject );

    const formGroup = {};
    const formControls = prop => new FormControl(
      R.view( R.lensPath( [ prop, 'value' ] ), this.dataObject ) || '',
      this.mapValidators( R.view( R.lensPath( [ prop, 'validation' ] ), this.dataObject ) )
    );
    const setFormGroup = prop => formGroup[ prop ] = formControls( prop );
    const mapPerson = R.map( setFormGroup );
    const composeFormControl = R.compose( mapPerson, R.keys );

    composeFormControl( this.dataObject );
    this.dynamicForm = new FormGroup( formGroup );
  }

  private initDynamicFormEmit() {
    const objParserDate = {};
    const generateNewObj = R.curry( ( obj, value, key ) => obj[ key ] = moment.isMoment( value ) ? moment( value ).format( 'YYYY-MM-DD' ) : value );
    const momentFunc = generateNewObj( objParserDate );
    const parserDate = R.forEachObjIndexed( momentFunc );

    const mappingMomentDate = value => {
      parserDate( value );
      return objParserDate;
    };
    const success = value => this.dynamicFormEmit.emit( value );

    this.dynamicForm.valueChanges
      .pipe(
        takeWhile( _ => this.isActive ),
        map( mappingMomentDate )
      )
      .subscribe( success );
  }

  private initSplitObjectProps() {
    const splitInput = this.splitInput || R.length( this.objectProps );
    const splitEvery = R.splitEvery( splitInput );
    this.splitObjectProps = splitEvery( this.objectProps );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}