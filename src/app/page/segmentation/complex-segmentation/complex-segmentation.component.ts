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
import { MatDialog } from '@angular/material';

@Component( {
  selector: 'app-complex-segmentation',
  templateUrl: './complex-segmentation.component.html',
  styleUrls: [ './complex-segmentation.component.styl' ]
} )
export class ComplexSegmentationComponent implements OnInit, OnDestroy {

  public segmentation: ISegmentation[];
  public complexSegmentation: ISegmentation[];
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
  private isActive: boolean;

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
    this.isActive = true;
    this.buttonSearch = true;
    this.buttonCreate = true;
    this.buttonSave = false;
    this.isLoader = true;
    this.isLoaderProfileTable = true;
    this.isTableProfileTable = false;
    this.isLoaderComplexSegmentationTable = true;
    this.initSegmentation();
    this.initFormAdd();
    this.initQueryParams();
    this.initTableProfilePagination();
    this.listSegmentationService.subjectSegmentations
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => this.refreshSegmentation() );
  }

  private initFormAdd() {
    this.formAdd = this.fb.group( {
      'segmentationTitle': [ '', Validators.required ],
      'segmentation': '',
    } );
  }

  private refreshSegmentation() {
    timer( 100 )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        this.isLoaderComplexSegmentationTable = true;
        this.initSegmentation();
      } );
  }

  private initSegmentation() {
    const notComplexSegmentation = R.reject( ( s: ISegmentation ) => s.isComplex );
    const isComplexSegmentation = R.filter( ( s: ISegmentation ) => s.isComplex );
    const success = segmentation => {
      this.segmentation = notComplexSegmentation( segmentation );
      this.complexSegmentation = isComplexSegmentation( segmentation );
      this.isLoaderComplexSegmentationTable = false;
      this.initAutocomplete();
    };

    this.listSegmentationService.getSegmentation()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( success );
  }

  private initAutocomplete() {
    this.segmentationOptions = this.formAdd.get( 'segmentation' ).valueChanges
      .pipe(
        takeWhile( _ => this.isActive ),
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
        this.segmentationId = params.segmentationId;
        this.buttonSearch = false;
        this.buttonCreate = false;
        this.buttonSave = true;
      }
    };

    this.route.queryParams
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( success );
  }

  private initComplexSegmentation( segmentationId: number ) {
    this.isLoader = true;
    this.addSegmentationService.getSegmentationParams( segmentationId )
      .pipe( takeWhile( _ => this.isActive ) )
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
    return composeFilter( this.segmentation );
  }

  private formFilling( complexSegmentation: IComplexSegmentation ) {
    this.formAdd.get( 'segmentationTitle' ).patchValue( complexSegmentation.segmentationTitle );
    this.selectionSegmentation = complexSegmentation.childSegmentations;
    this.isLoader = false;
  }

  private initTableProfilePagination() {
    this.tableAsyncService.subjectPage
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;
        const paramsAndCount = {
          'segmentationId': this.segmentationId,
          from: pageIndex,
          count: value.pageSize
        };
        this.addSegmentationService.getProfiles( paramsAndCount )
          .pipe( takeWhile( _ => this.isActive ) )
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
      .pipe( takeWhile( _ => this.isActive ) )
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
        .pipe( takeWhile( _ => this.isActive ) )
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
    }
  }

  public onDeleteSelectionSegmentation( id: number ): void {
    const segmentationId = item => item.segmentationId === id;
    const deleteSelectionSegmentation = R.reject( segmentationId );
    this.selectionSegmentation = deleteSelectionSegmentation( this.selectionSegmentation );
    if( R.isEmpty( this.selectionSegmentation  ) ) this.onClearForm();
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
      this.router.navigate( [ 'crm/complexsegmentation' ], { queryParams: { segmentationId: complexSegmentation.segmentationId } } );
      this.windowDialog( `Сегментация успешно сохранена`, 'ok' );
    };
    if ( !this.formAdd.invalid ) {
      this.complexSegmentationService.setComplexSegmentation( { segmentationTitle, segmentationsIds } )
        .pipe( takeWhile( _ => this.isActive ) )
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
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => this.windowDialog( `Сегментация успешно изменена`, 'ok' ) );
  }

  private onClearForm() {
    this.router.navigate( [ 'crm/complexsegmentation' ], { queryParams: { } } );
    this.formAdd.get( 'segmentationTitle' ).patchValue( '' );
    this.formAdd.get( 'segmentationTitle' ).setErrors( null );
    this.selectionSegmentation = [];
    this.buttonSearch = true;
    this.buttonCreate = true;
    this.buttonSave = false;
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}















