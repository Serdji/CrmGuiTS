import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component( {
  selector: 'app-distribution-report',
  templateUrl: './distribution-report.component.html',
  styleUrls: [ './distribution-report.component.styl' ]
} )
export class DistributionReportComponent implements OnInit, OnDestroy {

  private isActive: boolean;

  public isLinear = false;
  public templateForm: FormGroup;
  public dynamicForm: FormGroup;

  constructor( private fb: FormBuilder ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.initTemplateForm();
    this.initDynamicForm();
  }

  private initTemplateForm() {
    this.templateForm = this.fb.group( {
      firstCtrl: [ '', Validators.required ]
    } );
  }

  private initDynamicForm() {
    this.dynamicForm = this.fb.group( {
      secondCtrl: [ '', Validators.required ]
    } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
