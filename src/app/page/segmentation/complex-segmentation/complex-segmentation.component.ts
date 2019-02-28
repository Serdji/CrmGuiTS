import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-complex-segmentation',
  templateUrl: './complex-segmentation.component.html',
  styleUrls: ['./complex-segmentation.component.styl']
})
export class ComplexSegmentationComponent implements OnInit, OnDestroy {

  private isActive: boolean;

  constructor() { }

  ngOnInit(): void {
    this.isActive = true;
  }

  ngOnDestroy(): void {
    his.isActive = false;
  }

}
