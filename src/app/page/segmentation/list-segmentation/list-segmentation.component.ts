import { Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ListSegmentationService } from './list-segmentation.service';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-list-segmentation',
  templateUrl: './list-segmentation.component.html',
  styleUrls: ['./list-segmentation.component.styl']
})
export class ListSegmentationComponent implements OnInit, OnDestroy {

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
      .subscribe( params => {})
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
