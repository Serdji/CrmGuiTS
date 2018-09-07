import { Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-list-segmentation',
  templateUrl: './list-segmentation.component.html',
  styleUrls: ['./list-segmentation.component.styl']
})
export class ListSegmentationComponent implements OnInit, OnDestroy {

  private isActive: boolean;

  constructor() { }

  ngOnInit(): void {
    this.isActive = true;
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
