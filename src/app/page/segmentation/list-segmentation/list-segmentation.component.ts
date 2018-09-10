import { Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ListSegmentationService } from './list-segmentation.service';
import { takeWhile } from 'rxjs/operators';
import { ISegmentation } from '../../../interface/isegmentation';

@Component({
  selector: 'app-list-segmentation',
  templateUrl: './list-segmentation.component.html',
  styleUrls: ['./list-segmentation.component.styl']
})
export class ListSegmentationComponent implements OnInit, OnDestroy {

  public segmentation: ISegmentation[];

  private isActive: boolean;

  constructor(
    private listSegmentationService: ListSegmentationService
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.initSegmentation();
  }

  initSegmentation() {
    this.listSegmentationService.getSegmentation()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( segmentation => {
        this.segmentation = segmentation;
        console.log( segmentation ) ;
      })
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
