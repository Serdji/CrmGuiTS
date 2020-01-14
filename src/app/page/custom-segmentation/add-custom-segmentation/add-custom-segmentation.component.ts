import { Component, OnDestroy, OnInit } from '@angular/core';
import * as R from 'ramda';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddCustomSegmentationService } from './add-custom-segmentation.service';
import { IParamsDynamicForm } from '../../../interface/iparams-dynamic-form';
import { Observable, of } from 'rxjs';
import { ICustomSegmentationTemplate } from '../../../interface/icustom-segmentation-template';
import { map, mergeMap, tap } from 'rxjs/operators';
import * as _ from 'lodash';


@Component( {
  selector: 'app-add-custom-segmentation',
  templateUrl: './add-custom-segmentation.component.html',
  styleUrls: [ './add-custom-segmentation.component.styl' ]
} )
export class AddCustomSegmentationComponent implements OnInit, OnDestroy {

  public paramsDynamicForm: IParamsDynamicForm[];
  public templates$: Observable<ICustomSegmentationTemplate[]>;
  public isLouderDynamicForm: boolean;

  private formCustomSegmentation: FormGroup;
  private templateId: number;

  constructor(
    private addCustomSegmentationService: AddCustomSegmentationService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initTemplate();
    this.initDynamicForm();
    this.isLouderDynamicForm = false;
  }

  initForm() {
    this.formCustomSegmentation = this.fb.group( {
      title: '',
      template: ''
    } );
  }

  private initTemplate() {
    this.templates$ = this.addCustomSegmentationService.getCustomSegmentationTemplate();
  }

  private initDynamicForm() {
    const isLouderDynamicFormFn = _ => this.isLouderDynamicForm = !this.isLouderDynamicForm;
    const success = paramsDynamicForm => {
      this.paramsDynamicForm = paramsDynamicForm;
      this.templateId = _.chain( paramsDynamicForm ).find( 'templateId' ).get( 'templateId' ).value();
    };

    this.formCustomSegmentation.get( 'template' ).valueChanges
      .pipe(
        tap( isLouderDynamicFormFn ),
        mergeMap( templateId => this.addCustomSegmentationService.getCustomSegmentation( templateId )
          .pipe( map( params => _.map( params, val => _.set( val, 'templateId', templateId ) ) ) )
        ),
        tap( isLouderDynamicFormFn ),
        untilDestroyed( this )
      ).subscribe( success );
  }

  onReportGeneration( event: any ): void {
    console.log( event );
  }

  ngOnDestroy(): void {}

}
