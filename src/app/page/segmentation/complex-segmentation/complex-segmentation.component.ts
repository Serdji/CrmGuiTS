import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, takeWhile } from 'rxjs/operators';
import { ListSegmentationService } from '../list-segmentation/list-segmentation.service';
import { ISegmentation } from '../../../interface/isegmentation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import * as R from 'ramda';
import { ComplexSegmentationService } from './complex-segmentation.service';
import { IComplexSegmentatio } from '../../../interface/icomplex-segmentatio';

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

  private isActive: boolean;

  constructor(
    private listSegmentationService: ListSegmentationService,
    private complexSegmentationService: ComplexSegmentationService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.buttonSearch = true;
    this.buttonSave = false;
    this.buttonCreate = true;
    this.isLoader = true;
    this.initSegmentation();
    this.initFormAdd();
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

  private formFilling( complexSegmentation: IComplexSegmentatio ) {
    this.formAdd.get( 'segmentationTitle' ).patchValue( complexSegmentation.title );
    this.selectionSegmentation = complexSegmentation.childSegmentations;
    this.isLoader = false;
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

  public saveForm(): void {
    this.isLoader = true;
    const mapSegmentationId = selection => selection.segmentationId;
    const segmentationTitle = this.formAdd.get( 'segmentationTitle' ).value;
    const segmentationsIds = R.map( mapSegmentationId, this.selectionSegmentation );
    const params = { segmentationTitle, segmentationsIds };
    if ( !this.formAdd.invalid ) {
      this.complexSegmentationService.setComplexSegmentation( params )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( ( complexSegmentation: IComplexSegmentatio ) => this.formFilling( complexSegmentation ) );
    }
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
