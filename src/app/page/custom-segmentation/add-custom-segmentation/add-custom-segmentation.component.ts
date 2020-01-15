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
import { ActivatedRoute, Router } from '@angular/router';
import { TableAsyncService } from '../../../services/table-async.service';
import { ISegmentationProfile } from '../../../interface/isegmentation-profile';
import { IpagPage } from '../../../interface/ipag-page';
import { AddSegmentationService } from '../../segmentation/add-segmentation/add-segmentation.service';
import { timer } from 'rxjs/observable/timer';


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
  public isLoaderProfileTable: boolean;
  public isTableProfileTable: boolean;
  public segmentationProfiles: ISegmentationProfile;

  private formCustomSegmentation: FormGroup;
  private templateId: number;
  private segmentationId: number;

  constructor(
    private addCustomSegmentationService: AddCustomSegmentationService,
    private listSegmentationService: ListSegmentationService,
    private addSegmentationService: AddSegmentationService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private tableAsyncService: TableAsyncService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initTemplate();
    this.initDynamicForm();
    this.initCustomSegmentationTable();
    this.initQueryParams();
    this.initTableProfilePagination();
    this.isLouderDynamicForm = false;
    this.isLoaderCustomSegmentationTable = true;
  }

  private initQueryParams() {
    this.route.queryParams
      .pipe( untilDestroyed(this) )
      .subscribe( res => {
        const isKeySegmentationId = _.chain( res ).keys().first().value() === 'segmentationId';
        if ( isKeySegmentationId ) {
          this.initTableProfile( res.segmentationId );
          this.segmentationId = res.segmentationId;
        }
        this.isTableProfileTable = isKeySegmentationId;
        this.isLoaderProfileTable = isKeySegmentationId;
      } );
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

  isLoaderCustomSegmentationTableFn = () => this.isLoaderCustomSegmentationTable = !this.isLoaderCustomSegmentationTable;

  private initCustomSegmentationTable() {
    const success = ( segmentation: ISegmentation[] ) => this.customSegmentation = _.filter( segmentation, 'isCustom' );
    this.listSegmentationService.getSegmentation()
      .pipe(
        untilDestroyed( this ),
        tap( this.isLoaderCustomSegmentationTableFn )
      ).subscribe( success );
  }

  onReportGeneration( event: any ): void {
    this.isLoaderCustomSegmentationTableFn();
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
      .subscribe( () => this.initCustomSegmentationTable() );

  }

  private initTableProfilePagination() {
    this.tableAsyncService.subjectPage
      .pipe( untilDestroyed(this) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;
        const paramsAndCount = {
          'segmentationId': this.segmentationId,
          from: pageIndex,
          count: value.pageSize
        };
        this.addSegmentationService.getProfiles( paramsAndCount )
          .pipe( untilDestroyed(this) )
          .subscribe( ( segmentationProfiles: ISegmentationProfile ) => this.tableAsyncService.setTableDataSource( segmentationProfiles.customers ) );
      } );
  }

  private initTableProfile( id: number ) {
    const params = {
      segmentationId: id,
      from: 0,
      count: 10
    };
    this.addSegmentationService.getProfiles( params )
      .pipe( untilDestroyed(this) )
      .subscribe( ( segmentationProfiles: ISegmentationProfile ) => {
        this.tableAsyncService.countPage = segmentationProfiles.totalCount;
        this.segmentationProfiles = segmentationProfiles;
        this.isLoaderProfileTable = false;
      } );
  }

  onProfileSearch( segmentationId: number ): void {
    this.segmentationId = segmentationId;
    this.isTableProfileTable = true;
    this.isLoaderProfileTable = true;
    this.router.navigate( [ 'crm/add-custom-segmentation' ], { queryParams: { segmentationId } } );
    this.initTableProfile( this.segmentationId );
  }

  ngOnDestroy(): void {}

}
