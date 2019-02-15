import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { timer } from 'rxjs';

import { person } from './person';
import * as R from 'ramda';


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

  private initDynamicForm() {

    const objMerge = prop => R.merge( { key: prop }, person[ prop ] );
    const mapKeys = R.map( objMerge );
    const composeObjProps = R.compose( mapKeys, R.keys );
    this.objectProps = composeObjProps( person );

    const formGroup = {};
    // const formControls = prop => new FormControl( person[ prop ].value || '', this.mapValidators( person[ prop ].validation ) );
    // const setFormGroup = prop => R.assoc( prop, formControls( prop ), formGroup );
    // const mapPerson = R.map( setFormGroup );
    // const composeFormControl = R.compose( mapPerson, R.keys );

    for ( const prop of Object.keys( person ) ) {
      formGroup[ prop ] = new FormControl( person[ prop ].value || '', this.mapValidators( person[ prop ].validation ) );
    }

    // composeFormControl( person );

    console.log(formGroup);

    this.dynamicForm = new FormGroup( formGroup );
  }

  private mapValidators( validators ) {
    const formValidators = [];

    if ( validators ) {
      for ( const validation of Object.keys( validators ) ) {
        if ( validation === 'required' ) {
          formValidators.push( Validators.required );
        } else if ( validation === 'min' ) {
          formValidators.push( Validators.min( validators[ validation ] ) );
        }
      }
    }

    return formValidators;
  }

  stepperNext(): void {
    timer( 100 ).subscribe( _ => this.stepper.next() );
  }

  onSubmit( form ): void {
    console.log( form );
    this.stepper.next();
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
