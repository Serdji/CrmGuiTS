import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, takeWhile } from 'rxjs/operators';
import { ListSegmentationService } from '../list-segmentation/list-segmentation.service';
import { ISegmentation } from '../../../interface/isegmentation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import * as R from 'ramda';
import { ComplexSegmentationService } from './complex-segmentation.service';
import { IComplexSegmentation } from '../../../interface/icomplex-segmentation';
import { AddSegmentationService } from '../add-segmentation/add-segmentation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IpagPage } from '../../../interface/ipag-page';
import { ISegmentationProfile } from '../../../interface/isegmentation-profile';
import { TableAsyncService } from '../../../services/table-async.service';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component( {
  selector: 'app-complex-segmentation',
  templateUrl: './complex-segmentation.component.html',
  styleUrls: [ './complex-segmentation.component.styl' ]
} )
export class ComplexSegmentationComponent implements OnInit, OnDestroy {

  public segmentation: ISegmentation[];
  public complexSegmentation: ISegmentation[];
  public segmentationGranularity: ISegmentation[];
  public selectionSegmentation: ISegmentation[] = [];
  public segmentationOptions: Observable<ISegmentation[]>;
  public formAdd: FormGroup;
  public buttonSearch: boolean;
  public buttonSave: boolean;
  public buttonCreate: boolean;
  public isLoader: boolean;
  public segmentationProfiles: ISegmentationProfile;
  public isLoaderProfileTable: boolean;
  public isTableProfileTable: boolean;
  public isLoaderComplexSegmentationTable: boolean;

  private segmentationId: number;


  constructor(
    private listSegmentationService: ListSegmentationService,
    private addSegmentationService: AddSegmentationService,
    private complexSegmentationService: ComplexSegmentationService,
    private tableAsyncService: TableAsyncService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {

    this.buttonSearch = true;
    this.buttonCreate = true;
    this.buttonSave = false;
    this.isLoader = true;
    this.isLoaderProfileTable = true;
    this.isTableProfileTable = false;
    this.isLoaderComplexSegmentationTable = true;
    this.initFormAdd();
    this.initSegmentation();
    this.initQueryParams();
    this.initTableProfilePagination();
    this.listSegmentationService.subjectSegmentations
      .pipe( untilDestroyed(this) )
      .subscribe( _ => this.refreshSegmentation() );
  }

  private initFormAdd() {
    this.formAdd = this.fb.group( {
      'segmentationTitle': [ '', Validators.required ],
      'segmentationGranularity': '',
      'segmentation': '',
    } );
    this.formAdd.get( 'segmentation' ).disable();
  }

  private refreshSegmentation() {
    timer( 100 )
      .pipe( untilDestroyed(this) )
      .subscribe( _ => {
        this.isLoaderComplexSegmentationTable = true;
        this.initSegmentation();
      } );
  }

  private witchGranularity() {
    this.formAdd.get( 'segmentationGranularity' ).valueChanges
      .pipe( untilDestroyed(this) )
      .subscribe( ( granularity: number ) => {
        // @ts-ignore
        this.segmentationGranularity = R.filter( R.propEq( 'segmentationGranularity', +granularity ), this.segmentation );
        this.formAdd.get( 'segmentation' ).enable();
      } );
  }

  private initSegmentation() {
    const notComplexSegmentation = R.reject( ( s: ISegmentation ) => s.isComplex );
    const isComplexSegmentation = R.filter( ( s: ISegmentation ) => s.isComplex );
    const success = segmentation => {
      this.segmentation = notComplexSegmentation( segmentation );
      this.complexSegmentation = isComplexSegmentation( segmentation );
      this.isLoaderComplexSegmentationTable = false;
      this.witchGranularity();
      this.initAutocomplete();
    };

    this.listSegmentationService.getSegmentation()
      .pipe( untilDestroyed(this) )
      .subscribe( success );
  }

  private initAutocomplete() {
    this.segmentationOptions = this.formAdd.get( 'segmentation' ).valueChanges
      .pipe(
        untilDestroyed(this),
        map( value => typeof value === 'string' ? value : value.title ),
        map( title => this._filter( title ) )
      );
  }

  private initQueryParams() {
    const success = params => {
      const hasSegmentationId = R.has( 'segmentationId' );
      if ( hasSegmentationId( params ) ) {
        this.initComplexSegmentation( params.segmentationId );
        this.initSegmentation();
        this.formAdd.get( 'segmentationGranularity' ).disable();
        this.segmentationId = params.segmentationId;
        this.buttonSearch = false;
        this.buttonCreate = false;
        this.buttonSave = true;
      }
    };

    this.route.queryParams
      .pipe( untilDestroyed(this) )
      .subscribe( success );
  }

  private initComplexSegmentation( segmentationId: number ) {
    this.isLoader = true;
    this.addSegmentationService.getSegmentationParams( segmentationId )
      .pipe( untilDestroyed(this) )
      .subscribe( ( complexSegmentation: IComplexSegmentation ) => this.formFilling( complexSegmentation ) );
  }

  public displayFn( segmentation?: ISegmentation ): string | undefined {
    return segmentation ? segmentation.title : undefined;
  }

  private differenceSegmentationFn() {
    // @ts-ignore
    return R.difference( R.__, this.selectionSegmentation );
  }

  private _filter( title: string ): ISegmentation[] {
    const includes = R.includes( R.toLower( title ) );
    const composeInc = R.compose( includes, R.toLower );
    const filterIter = segmentation => composeInc( segmentation.title );
    const filterSegmentation = R.filter( filterIter );
    const differenceSegmentation = this.differenceSegmentationFn();
    const composeFilter = R.compose( filterSegmentation, differenceSegmentation );
    // @ts-ignore
    return composeFilter( this.segmentationGranularity );
  }

  private formFilling( complexSegmentation: IComplexSegmentation ) {
    const segmentationGranularity = complexSegmentation.childSegmentations[ 0 ].segmentationGranularity;
    this.formAdd.get( 'segmentationTitle' ).patchValue( complexSegmentation.segmentationTitle );
    this.formAdd.get( 'segmentationGranularity' ).patchValue( segmentationGranularity + '');
    this.selectionSegmentation = complexSegmentation.childSegmentations;
    this.isLoader = false;
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

  private windowDialog( messDialog: string, params: string, card: string = '', disableTimer: boolean = false ) {
    this.dialog.open( DialogComponent, {
      data: {
        message: messDialog,
        status: params,
        params: this.segmentationId,
        card,
      },
    } );
    if ( !disableTimer ) {
      timer( 1500 )
        .pipe( untilDestroyed(this) )
        .subscribe( _ => {
          this.dialog.closeAll();
        } );
    }
  }

  public onAdd(): void {
    const value = this.formAdd.get( 'segmentation' ).value;
    const isObject = R.is( Object );
    if ( isObject( value ) ) {
      const prependSegmentation = R.prepend( value );
      this.selectionSegmentation = prependSegmentation( this.selectionSegmentation );
      this.formAdd.get( 'segmentation' ).patchValue( '' );
      this.isLoader = false;
      this.formAdd.get( 'segmentationGranularity' ).disable();
    }
  }

  public onDeleteSelectionSegmentation( id: number ): void {
    const segmentationId = item => item.segmentationId === id;
    const deleteSelectionSegmentation = R.reject( segmentationId );
    this.selectionSegmentation = deleteSelectionSegmentation( this.selectionSegmentation );
    if ( R.isEmpty( this.selectionSegmentation ) ) this.onClearForm();
  }

  public onSaveForm(): void {
    this.isLoader = true;
    this.isLoaderComplexSegmentationTable = true;
    const mapSegmentationId = selection => selection.segmentationId;
    const segmentationTitle = this.formAdd.get( 'segmentationTitle' ).value;
    const segmentationsIds = R.map( mapSegmentationId, this.selectionSegmentation );
    const success = ( complexSegmentation: IComplexSegmentation ) => {
      this.formFilling( complexSegmentation );
      this.buttonSearch = false;
      this.buttonCreate = false;
      this.buttonSave = true;
      this.router.navigate( [ 'crm/complex-segmentation' ], { queryParams: { segmentationId: complexSegmentation.segmentationId } } );
      this.windowDialog( `DIALOG.OK.SEGMENTATION_SAVE`, 'ok' );
    };
    if ( !this.formAdd.invalid ) {
      this.complexSegmentationService.setComplexSegmentation( { segmentationTitle, segmentationsIds } )
        .pipe( untilDestroyed(this) )
        .subscribe( success );
    }
  }

  public onSearchForm(): void {
    this.isTableProfileTable = true;
    this.isLoaderProfileTable = true;
    this.initTableProfile( this.segmentationId );
  }

  onCreateForm(): void {
    const mapSegmentationId = selection => selection.segmentationId;
    const segmentationId = this.segmentationId;
    const segmentationTitle = this.formAdd.get( 'segmentationTitle' ).value;
    const segmentationsIds = R.map( mapSegmentationId, this.selectionSegmentation );
    this.complexSegmentationService.putComplexSegmentation( { segmentationId, segmentationTitle, segmentationsIds } )
      .pipe( untilDestroyed(this) )
      .subscribe( _ => this.windowDialog( `DIALOG.OK.SEGMENTATION_CHANGED`, 'ok' ) );
  }

  private onClearForm() {
    this.router.navigate( [ 'crm/complex-segmentation' ], { queryParams: {} } );
    this.formAdd.get( 'segmentationTitle' ).patchValue( '' );
    this.formAdd.get( 'segmentationGranularity' ).patchValue( '' );
    this.formAdd.get( 'segmentationTitle' ).setErrors( null );
    this.selectionSegmentation = [];
    this.buttonSearch = true;
    this.buttonCreate = true;
    this.buttonSave = false;
    this.formAdd.get( 'segmentationGranularity' ).enable();
    this.formAdd.get( 'segmentation' ).disable();
  }

  ngOnDestroy(): void {}
}
