import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, startWith, takeWhile } from 'rxjs/operators';
import { ListSegmentationService } from '../list-segmentation/list-segmentation.service';
import { ISegmentation } from '../../../interface/isegmentation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component( {
  selector: 'app-complex-segmentation',
  templateUrl: './complex-segmentation.component.html',
  styleUrls: [ './complex-segmentation.component.styl' ]
} )
export class ComplexSegmentationComponent implements OnInit, OnDestroy {

  public segmentation: ISegmentation[];
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
    this.segmentationOptions = this.formAdd.valueChanges
      .pipe(
        takeWhile( _ => this.isActive ),
        startWith<string | ISegmentation>( '' ),
        map( value => typeof value === 'string' ? value : value.title ),
        map( title => title ? this._filter( title ) : this.segmentation.slice() )
      );
  }

  public displayFn( segmentation?: ISegmentation ): string | undefined {
    return segmentation ? segmentation.title : undefined;
  }

  private _filter( title: string ): ISegmentation[] {
    const filterValue = title.toLowerCase();

    return this.segmentation.filter( segmentation => segmentation.title.toLowerCase().indexOf( filterValue ) === 0 );
  }

  public onAdd(): void {
    console.log(this.formAdd.get('segmentation').value);
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
