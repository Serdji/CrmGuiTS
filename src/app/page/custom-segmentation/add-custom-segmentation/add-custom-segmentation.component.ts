import { Component, OnDestroy, OnInit } from '@angular/core';
import * as R from 'ramda';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddCustomSegmentationService } from './add-custom-segmentation.service';
import { IParamsDynamicForm } from '../../../interface/iparams-dynamic-form';
import { Observable, of } from 'rxjs';
import { ICustomSegmentationTemplate } from '../../../interface/icustom-segmentation-template';
import { filter, map, mergeMap, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { ICustomSegmentationParams } from '../../../interface/icustom-segmentation-params';
import { ListSegmentationService } from '../../segmentation/list-segmentation/list-segmentation.service';
import { ISegmentation } from '../../../interface/isegmentation';


@Component( {
  selector: 'app-add-custom-segmentation',
  templateUrl: './add-custom-segmentation.component.html',
  styleUrls: [ './add-custom-segmentation.component.styl' ]
} )
export class AddCustomSegmentationComponent implements OnInit, OnDestroy {

  public paramsDynamicForm: IParamsDynamicForm[];
  public templates$: Observable<ICustomSegmentationTemplate[]>;
  public customSegmentation: ISegmentation[];
  public isLouderDynamicForm: boolean;
  public isLoaderCustomSegmentationTable: boolean;

  private formCustomSegmentation: FormGroup;
  private templateId: number;

  constructor(
    private addCustomSegmentationService: AddCustomSegmentationService,
    private listSegmentationService: ListSegmentationService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initTemplate();
    this.initDynamicForm();
    this.initCustomSegmentationTable();
    this.isLouderDynamicForm = false;
    this.isLoaderCustomSegmentationTable = true;
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

  private initCustomSegmentationTable() {
    const isLoaderCustomSegmentationTableFn = _ => this.isLoaderCustomSegmentationTable = !this.isLoaderCustomSegmentationTable;
    const success = ( segmentation: ISegmentation[] ) => this.customSegmentation = _.filter( segmentation, 'isCustom' );
    this.listSegmentationService.getSegmentation()
      .pipe(
        untilDestroyed( this ),
        tap( isLoaderCustomSegmentationTableFn )
      ).subscribe( success );
  }

  onReportGeneration( event: any ): void {
    const CustomSegmentationParameters: ICustomSegmentationParams['CustomSegmentationParameters'] = _.map( this.paramsDynamicForm, DynamicForm => {
      const value = {};
      _.each( event, ( val, key ) => {
        if ( DynamicForm.name === key ) _.merge( value, { ParameterId: DynamicForm.id, values: val } );
      } );
      return value;
    } ) as ICustomSegmentationParams['CustomSegmentationParameters'];

    const params: ICustomSegmentationParams = {
      CustomSegmentationTemplateId: this.templateId,
      Title: this.formCustomSegmentation.get( 'title' ).value,
      Description: '',
      CustomSegmentationParameters,
    };

    this.addCustomSegmentationService.setCustomSegmentation( params )
      .pipe( untilDestroyed( this ) )
      .subscribe( value => console.log( value ) );

  }

  ngOnDestroy(): void {}

}
