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
  private dynamicFormValue: any;

  public templateForm: FormGroup;
  public dynamicForm: FormGroup;
  public person: any;

  @ViewChild( 'stepper' ) stepper;

  constructor( private fb: FormBuilder ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.initTemplateForm();
  }

  private initTemplateForm() {
    this.templateForm = this.fb.group( {
      template: [ '', Validators.required ]
    } );
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
