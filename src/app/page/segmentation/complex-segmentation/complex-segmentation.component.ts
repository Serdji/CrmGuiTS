import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, startWith, takeWhile } from 'rxjs/operators';
import { ListSegmentationService } from '../list-segmentation/list-segmentation.service';
import { ISegmentation } from '../../../interface/isegmentation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import * as R from 'ramda';

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

  private isActive: boolean;

  constructor(
    private listSegmentationService: ListSegmentationService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.initSegmentation();
    this.initFormAdd();
  }

  private initFormAdd() {
    this.formAdd = this.fb.group( {
      'title': [ '', Validators.required ],
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

  private _filter( title: string ): ISegmentation[] {
    const includes = R.includes( R.toLower( title ) );
    const composeInc = R.compose( includes, R.toLower );
    const filterIter = segmentation => composeInc( segmentation.title );
    const filterSegmentation = R.filter( filterIter );
    // @ts-ignore
    const differenceSegmentation = R.difference( R.__, this.selectionSegmentation );
    const composeFilter = R.compose( filterSegmentation, differenceSegmentation );
    // @ts-ignore
    return composeFilter( this.segmentation );
  }

  public onAdd(): void {
    const value = this.formAdd.get( 'segmentation' ).value;
    const isObject = R.is( Object );
    if ( isObject( value ) ) {
      const appendSegmentation = R.append( value );
      this.selectionSegmentation = appendSegmentation( this.selectionSegmentation );
      this.formAdd.get( 'segmentation' ).patchValue( '' );
    }
    console.log( this.selectionSegmentation );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
