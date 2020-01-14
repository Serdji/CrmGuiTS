import { Component, OnDestroy, OnInit } from '@angular/core';
import * as R from 'ramda';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddCustomSegmentationService } from './add-custom-segmentation.service';
import { IParamsDynamicForm } from '../../../interface/iparams-dynamic-form';
import { Observable, of } from 'rxjs';
import { ICustomSegmentationTemplate } from '../../../interface/icustom-segmentation-template';
import { mergeMap } from 'rxjs/operators';


@Component( {
  selector: 'app-add-custom-segmentation',
  templateUrl: './add-custom-segmentation.component.html',
  styleUrls: [ './add-custom-segmentation.component.styl' ]
} )
export class AddCustomSegmentationComponent implements OnInit, OnDestroy {

  public paramsDynamicForm: IParamsDynamicForm[] = [
    {
      'name': 'SegmentsFrom',
      'dataType': 3,
      'nullable': true,
      'allowBlank': false,
      'multiValue': false,
      'isQueryParameter': false,
      'prompt': 'Количество сегментов от',
      'promptUser': true,
      'values': [ '10' ]
    }, {
      'name': 'Dep_DFrom',
      'dataType': 1,
      'nullable': true,
      'allowBlank': false,
      'multiValue': false,
      'isQueryParameter': false,
      'prompt': 'Дата вылета с',
      'promptUser': true,
      'values': [ '1/1/2019 12:00:00 AM' ]
    }, {
      'name': 'Dep_DTo',
      'dataType': 1,
      'nullable': true,
      'allowBlank': false,
      'multiValue': false,
      'isQueryParameter': false,
      'prompt': 'Дата вылета по',
      'promptUser': true,
      'values': [ '1/1/2100 12:00:00 AM' ]
    }, {
      'name': 'Dep_L',
      'dataType': 4,
      'nullable': true,
      'allowBlank': false,
      'multiValue': false,
      'isQueryParameter': false,
      'prompt': 'Откуда',
      'promptUser': true,
      'values': [ null ]
    }, {
      'name': 'Arr_L',
      'dataType': 4,
      'nullable': true,
      'allowBlank': false,
      'multiValue': false,
      'isQueryParameter': false,
      'prompt': 'Куда',
      'promptUser': true,
      'values': [ null ]
    }, {
      'name': 'FareCode',
      'dataType': 4,
      'nullable': true,
      'allowBlank': false,
      'multiValue': false,
      'isQueryParameter': false,
      'prompt': 'Код тарифа',
      'promptUser': true,
      'values': [ null ]
    }, {
      'name': 'PosGds',
      'dataType': 4,
      'nullable': true,
      'allowBlank': false,
      'multiValue': false,
      'isQueryParameter': false,
      'prompt': 'Код ГРС',
      'promptUser': true,
      'values': [ null ]
    }, {
      'name': 'PosId',
      'dataType': 4,
      'nullable': true,
      'allowBlank': false,
      'multiValue': false,
      'isQueryParameter': false,
      'prompt': 'Код ППР',
      'promptUser': true,
      'values': [ null ]
    }, {
      'name': 'PosAgency',
      'dataType': 4,
      'nullable': true,
      'allowBlank': false,
      'multiValue': false,
      'isQueryParameter': false,
      'prompt': 'Код агентства',
      'promptUser': true,
      'values': [ null ]
    }
  ];
  public templates: Observable<ICustomSegmentationTemplate[]>;

  private formCustomSegmentation: FormGroup;

  constructor(
    private addCustomSegmentationService: AddCustomSegmentationService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initTemplate();
    this.initDynamicForm();
  }

  initForm() {
    this.formCustomSegmentation = this.fb.group( {
      title: '',
      template: ''
    } );
  }

  private initTemplate() {
    this.templates = this.addCustomSegmentationService.getCustomSegmentationTemplate();
  }

  private initDynamicForm() {
    this.formCustomSegmentation.get( 'template' ).valueChanges
      .pipe(
        mergeMap( val => of( val ) ),
        untilDestroyed( this )
        )
      .subscribe(console.log);
  }

  onReportGeneration( event: any ): void {
    console.log( event );
  }

  ngOnDestroy(): void {}

}
