import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as R from 'ramda';
import * as moment from 'moment';
import * as _ from 'lodash';
import { IParamsDynamicForm } from '../../interface/iparams-dynamic-form';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { timer } from 'rxjs';

@Component( {
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: [ './dynamic-form.component.styl' ]
} )
export class DynamicFormComponent implements OnInit, OnDestroy {

  public dynamicForm: FormGroup;
  public objectProps: any;
  public splitObjectProps: any;
  public buttonDisabled: boolean;


  private dataObject: any = {};

  @Input() cols: number;
  @Input() rowHeight: string;
  @Input() paramsDynamicForm: IParamsDynamicForm[];
  @Input() splitInput: number;
  @Output() dynamicFormEmit: EventEmitter<any> = new EventEmitter<any>();

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.initParameterConversion();
    this.initButtonDisabled();
    this.autoFocusAndBlur( );
  }


  private initParameterConversion() {
    const typeCheck = ( typeNumber: number ): string => {
      switch ( typeNumber ) {
        case 0: return 'checkbox'; break;
        case 1: return 'date'; break;
        case 2:
        case 3:
        case 4: return 'text'; break;
      }
    };
    const mapParamsDynamicForm = R.map( ( paramsDynamicForm: IParamsDynamicForm ) => {
      this.dataObject = R.merge( this.dataObject, {
        [`${paramsDynamicForm.name}`]: {
          placeholder: paramsDynamicForm.prompt,
          value: typeCheck( paramsDynamicForm.dataType ) === 'date' ? new Date(paramsDynamicForm.values[0]) : paramsDynamicForm.values[0],
          type: typeCheck( paramsDynamicForm.dataType ),
          validators: { required: !paramsDynamicForm.nullable }
        }
      } );
      this.initDynamicForm();
      this.initSplitObjectProps();
    } );
    mapParamsDynamicForm( this.paramsDynamicForm );
    this.buttonDisabled = this.dynamicForm.invalid;
  }

  private initButtonDisabled() {
    this.dynamicForm.valueChanges
      .pipe( untilDestroyed(this) )
      .subscribe( _ => this.buttonDisabled = this.dynamicForm.invalid );
  }

  private initDynamicForm() {
    const objMerge = prop => R.merge( { key: prop }, this.dataObject[ prop ] );
    const mapKeys = R.map( objMerge );
    const composeObjProps = R.compose( mapKeys, R.keys );
    this.objectProps = composeObjProps( this.dataObject );
    const formGroup = {};
    const formControls = prop => {
      return new FormControl(
        R.path([ prop, 'value' ], this.dataObject ) || '',
        this.mapValidators( R.path( [ prop, 'validators' ], this.dataObject ) )
      );
    }
    const setFormGroup = prop => formGroup[ prop ] = formControls( prop );
    const mapPerson = R.map( setFormGroup );
    const composeFormControl = R.compose( mapPerson, R.keys );

    composeFormControl( this.dataObject );
    this.dynamicForm = new FormGroup( formGroup );
  }


  private initSplitObjectProps() {
    const splitInput = this.splitInput || R.length( this.objectProps );
    const splitEvery = R.splitEvery( splitInput );
    this.splitObjectProps = splitEvery( this.objectProps );
  }

  private autoFocusAndBlur( ): void {
    _.each( this.dynamicForm.getRawValue() , ( val, key ) => {
      timer( 0 )
        .pipe( untilDestroyed( this ) )
        .subscribe( _ =>  {
          this.renderer.selectRootElement( `#${ key }` ).focus();
          this.renderer.selectRootElement( `#${ key }` ).blur();
        } );
    } );
  }

  private mapValidators( validators ) {
    const formValidators = [];
    const mapValidationFunc = validation => {
      if ( validators[ validation ] ) {
        switch ( validation ) {
          case 'required': formValidators.push( Validators.required ); break;
          case 'max': formValidators.push( Validators.max( validators[ validation ] ) ); break;
          case 'min': formValidators.push( Validators.min( validators[ validation ] ) ); break;
          case 'email': formValidators.push( Validators.email ); break;
        }
      }
    };
    const mapValidation = R.map( mapValidationFunc );
    const composeValidation = R.compose( mapValidation, R.keys );

    if ( validators ) composeValidation( validators );
    return formValidators;
  }

  onDynamicFormEmit(): void {
    const objParserDate = {};
    const parserDate = ( value, key ) => objParserDate[ key ] = moment.isDate( value ) || moment.isMoment( value ) ? moment( value ).format( 'YYYY.MM.DD' ) : value;
    R.forEachObjIndexed( parserDate, this.dynamicForm.getRawValue() );
    this.dynamicFormEmit.emit( objParserDate );
  }

  ngOnDestroy(): void {}

}
