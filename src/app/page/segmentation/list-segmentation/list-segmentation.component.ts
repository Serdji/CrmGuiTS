import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListSegmentationService } from './list-segmentation.service';
import { takeWhile } from 'rxjs/operators';
import { ISegmentation } from '../../../interface/isegmentation';
import { timer } from '../../../../../node_modules/rxjs/observable/timer';

@Component( {
  selector: 'app-list-segmentation',
  templateUrl: './list-segmentation.component.html',
  styleUrls: [ './list-segmentation.component.styl' ]
} )
export class ListSegmentationComponent implements OnInit, OnDestroy {

  public segmentation: ISegmentation[];
  public isLoader: boolean;
  private isActive: boolean;

  constructor(
    private listSegmentationService: ListSegmentationService
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.isLoader = true;
    this.initSegmentation();
    this.listSegmentationService.subjectSegmentations
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => this.refreshSegmentation() );
  }

  private refreshSegmentation() {
    timer( 100 )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        this.isLoader = true;
        this.initSegmentation();
      } );
  }

  initSegmentation() {
    this.listSegmentationService.getSegmentation()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( segmentation => {
        this.segmentation = segmentation;
        this.isLoader = false;
        console.log( segmentation );
      } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
