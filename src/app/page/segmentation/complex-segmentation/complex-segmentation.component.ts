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
  public selectionSegmentation: ISegmentation[];
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
        console.log( this.segmentation );
      } );
  }

  private initAutocomplete() {
    this.segmentationOptions = this.formAdd.get( 'segmentation' ).valueChanges
      .pipe(
        takeWhile( _ => this.isActive ),
        map( value => typeof value === 'string' ? value : value.title ),
        map( title => title ? this._filter( title ) : this.segmentation.slice() )
      );
  }

  public displayFn( segmentation?: ISegmentation ): string | undefined {
    return segmentation ? segmentation.title : undefined;
  }

  private _filter( title: string ): ISegmentation[] {
    const toLower = R.toLower;
    const includes = R.includes( toLower( title ) );
    const filterIter = segmentation => includes( toLower( segmentation.title ) );
    const filterSegmentation = R.filter( filterIter );
    return filterSegmentation( this.segmentation );
  }

  public onAdd(): void {
    const appendSegmentation = R.append( this.formAdd.get( 'segmentation' ).value );
    this.selectionSegmentation = appendSegmentation( this.selectionSegmentation );
    console.log( this.selectionSegmentation );
    this.formAdd.get( 'segmentation' ).patchValue( '' );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
