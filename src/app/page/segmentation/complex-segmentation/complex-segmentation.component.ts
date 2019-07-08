import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, takeWhile } from 'rxjs/operators';
import { ListSegmentationService } from '../list-segmentation/list-segmentation.service';
import { ISegmentation } from '../../../interface/isegmentation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import * as R from 'ramda';
import { ComplexSegmentationService } from './complex-segmentation.service';
import { IComplexSegmentation } from '../../../interface/icomplex-segmentation';
import { AddSegmentationService } from '../add-segmentation/add-segmentation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IpagPage } from '../../../interface/ipag-page';
import { ISegmentationProfile } from '../../../interface/isegmentation-profile';
import { TableAsyncService } from '../../../services/table-async.service';

@Component( {
  selector: 'app-complex-segmentation',
  templateUrl: './complex-segmentation.component.html',
  styleUrls: [ './complex-segmentation.component.styl' ]
} )
export class ComplexSegmentationComponent implements OnInit, OnDestroy {

  public segmentation: ISegmentation[];
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

  private segmentationId: number;
  private isActive: boolean;

  constructor(
    private listSegmentationService: ListSegmentationService,
    private addSegmentationService: AddSegmentationService,
    private complexSegmentationService: ComplexSegmentationService,
    private tableAsyncService: TableAsyncService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.buttonSearch = true;
    this.buttonCreate = true;
    this.buttonSave = false;
    this.isLoader = true;
    this.isLoaderProfileTable = true;
    this.isTableProfileTable = false;
    this.initSegmentation();
    this.initFormAdd();
    this.initQueryParams();
    this.initTableProfilePagination();
  }

  private initFormAdd() {
    this.formAdd = this.fb.group( {
      'segmentationTitle': [ '', Validators.required ],
      'segmentation': '',
    } );
  }

  private initSegmentation() {
    this.listSegmentationService.getSegmentation()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( segmentation => {
        this.segmentation = segmentation;
        this.initAutocomplete();
      } );
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
    this.route.queryParams
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( params => {
        const hasSegmentationId = R.has( 'segmentationId' );
        if ( hasSegmentationId( params ) ) {
          this.initComplexSegmentation( params.segmentationId );
          this.segmentationId = params.segmentationId;
          this.buttonSearch = false;
          this.buttonCreate = false;
          this.buttonSave = true;
        }
      } );
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
  }

  public onSaveForm(): void {
    this.isLoader = true;
    const mapSegmentationId = selection => selection.segmentationId;
    const segmentationTitle = this.formAdd.get( 'segmentationTitle' ).value;
    const segmentationsIds = R.map( mapSegmentationId, this.selectionSegmentation );
    const success = ( complexSegmentation: IComplexSegmentation ) => {
      this.formFilling( complexSegmentation );
      this.buttonSearch = false;
      this.buttonCreate = false;
      this.buttonSave = true;
      this.router.navigate( [ 'crm/complexsegmentation' ], { queryParams: { segmentationId: complexSegmentation.segmentationId } } );
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

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
