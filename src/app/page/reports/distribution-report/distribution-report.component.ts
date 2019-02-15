import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { timer } from 'rxjs';

import { person } from './person';


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

    // remap the API to be suitable for iterating over it
    this.objectProps =
      Object.keys( person )
        .map( prop => {
          return Object.assign( {}, { key: prop }, person[ prop ] );
        } );

    // setup the form
    const formGroup = {};
    for ( const prop of Object.keys( person ) ) {
      formGroup[ prop ] = new FormControl( person[ prop ].value || '', this.mapValidators( person[ prop ].validation ) );
    }

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
    timer( 1000 ).subscribe( _ => this.stepper.next() );
  }

  onSubmit( form ): void {
    console.log( form );
    this.stepper.next();
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
