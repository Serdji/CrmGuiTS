import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as R from 'ramda';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddCustomSegmentationService } from './add-custom-segmentation.service';
import { IParamsDynamicForm } from '../../../interface/iparams-dynamic-form';
import { Observable, of } from 'rxjs';
import { ICustomSegmentationTemplate } from '../../../interface/icustom-segmentation-template';
import { filter, map, mergeMap, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { ICustomSegmentationParams } from '../../../interface/icustom-segmentation-params';
import { ISegmentation } from '../../../interface/isegmentation';
import { ActivatedRoute, Router } from '@angular/router';
import { TableAsyncService } from '../../../services/table-async.service';
import { ISegmentationProfile } from '../../../interface/isegmentation-profile';
import { IpagPage } from '../../../interface/ipag-page';
import { timer } from 'rxjs/observable/timer';
import { ICustomSegmentationGetParams } from '../../../interface/icustom-segmentation-get-params';
import { ListSegmentationService } from '../list-segmentation/list-segmentation.service';
import { AddSegmentationService } from '../add-segmentation/add-segmentation.service';
import { logger } from 'codelyzer/util/logger';


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
  public isEditCustomSegmentation: boolean;

  private formCustomSegmentation: FormGroup;
  private templateId: number;
  private segmentationId: number;

  @ViewChild( 'title', { static: true } ) inputNameTitle: ElementRef;

  constructor(
    private renderer: Renderer2,
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
    this.isEditCustomSegmentation = false;
    this.isLouderDynamicForm = false;
    this.isLoaderCustomSegmentationTable = true;
    this.listSegmentationService.subjectSegmentations
      .pipe( untilDestroyed( this ) )
      .subscribe( _ => this.refreshSegmentation() );
  }

  private refreshSegmentation() {
    timer( 500 )
      .pipe( untilDestroyed( this ) )
      .subscribe( _ => {
        this.isLoaderCustomSegmentationTable = true;
        this.initCustomSegmentationTable();
      } );
  }

  private initQueryParams() {
    this.route.queryParams
      .pipe( untilDestroyed( this ) )
      .subscribe( res => {
        if ( _.has( res, 'segmentationId' ) ) {
          const isKeySegmentationId = _.chain( res ).keys().first().value() === 'segmentationId';
          this.segmentationId = res.segmentationId;
          this.isLouderDynamicForm = true;
          this.initTableProfile( res.segmentationId );
          this.addCustomSegmentationService.getCustomSegmentationParams( res.segmentationId )
            .pipe( untilDestroyed( this ) )
            .subscribe( ( customSegmentationGetParams: ICustomSegmentationGetParams ) => {
              this.isEditCustomSegmentation = true;
              this.formCustomSegmentation.patchValue( customSegmentationGetParams );
              this.paramsDynamicForm = customSegmentationGetParams.customSegmentationParameters;
              this.isLouderDynamicForm = false;
            } );
          this.isTableProfileTable = isKeySegmentationId;
          this.isLoaderProfileTable = isKeySegmentationId;
        } else {
          this.isEditCustomSegmentation = false;
          this.clearForm();
        }
      } );
  }

  initForm() {
    this.formCustomSegmentation = this.fb.group( {
      title: [ '', Validators.required ],
      customSegmentationTemplateId: '',
      description: ''
    } );
  }

  private clearForm() {
    _.each( this.formCustomSegmentation.getRawValue(), ( val, key ) => {
      this.formCustomSegmentation.get( key ).patchValue( null );
      this.formCustomSegmentation.get( key ).setErrors( null );
    } );
  }

  private initTemplate() {
    this.templates$ = this.addCustomSegmentationService.getCustomSegmentationTemplate();
  }

  private initDynamicForm() {
    const success = paramsDynamicForm => this.paramsDynamicForm = paramsDynamicForm;
    this.formCustomSegmentation.get( 'customSegmentationTemplateId' ).valueChanges
      .pipe(
        tap( val => {
          this.templateId = val;
          if ( val === '0' ) this.router.navigate( [ 'crm/add-custom-segmentation' ], {} );
        } ),
        tap( _ => this.isLouderDynamicForm = true ),
        mergeMap( templateId => _.isNil( templateId ) ? of( templateId ) : this.addCustomSegmentationService.getCustomSegmentation( templateId ) ),
        untilDestroyed( this ),
        tap( _ => this.isLouderDynamicForm = false ),
      ).subscribe( success );
  }

  private initCustomSegmentationTable() {
    const success = ( segmentation: ISegmentation[] ) => this.customSegmentation = _.filter( segmentation, 'isCustom' );
    this.listSegmentationService.getSegmentation()
      .pipe(
        untilDestroyed( this ),
        tap( _ => this.isLoaderCustomSegmentationTable = false )
      ).subscribe( success );
  }

  private generationParams( event: any ) {
    this.isLoaderCustomSegmentationTable = true;
    const CustomSegmentationParameters: ICustomSegmentationParams['CustomSegmentationParameters'] = _.map( this.paramsDynamicForm, DynamicForm => {
      const value = {};
      _.each( event, ( val, key ) => {
        if ( DynamicForm.name === key ) _.merge( value, { ParameterId: DynamicForm.id, value: val } );
      } );
      return value;
    } ) as ICustomSegmentationParams['CustomSegmentationParameters'];

    const params: ICustomSegmentationParams = {
      CustomSegmentationTemplateId: this.templateId,
      Title: this.formCustomSegmentation.get( 'title' ).value,
      Description: this.formCustomSegmentation.get( 'description' ).value,
      CustomSegmentationParameters,
    };
    return params;
  }

  private autoFocusAndBlur(): void {
    this.inputNameTitle.nativeElement.focus();
    this.inputNameTitle.nativeElement.blur();
  }

  onSendCustomSegmentationParams( event: any ): void {
    if ( !this.formCustomSegmentation.invalid ) {
      const params = this.generationParams( event );
      this.addCustomSegmentationService.setCustomSegmentation( params )
        .pipe( untilDestroyed( this ) )
        .subscribe( () => this.initCustomSegmentationTable() );
    } else {
      this.autoFocusAndBlur();
    }
  }

  onEditCustomSegmentationParams( event: any ): void {
    if ( !this.formCustomSegmentation.invalid ) {
      const params = _.set( this.generationParams( event ), 'CustomSegmentationId', this.segmentationId );
      this.addCustomSegmentationService.putCustomSegmentation( params )
        .pipe( untilDestroyed( this ) )
        .subscribe( () => this.initCustomSegmentationTable() );
    } else {
      this.autoFocusAndBlur();
    }
  }

  private initTableProfilePagination() {
    this.tableAsyncService.subjectPage
      .pipe( untilDestroyed( this ) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;
        const paramsAndCount = {
          'segmentationId': this.segmentationId,
          from: pageIndex,
          count: value.pageSize
        };
        this.addSegmentationService.getProfiles( paramsAndCount )
          .pipe( untilDestroyed( this ) )
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
      .pipe( untilDestroyed( this ) )
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
