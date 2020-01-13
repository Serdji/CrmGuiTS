import { Component, OnInit } from '@angular/core';
import * as R from 'ramda';
import { untilDestroyed } from 'ngx-take-until-destroy';



@Component({
  selector: 'app-custom-segmentation',
  templateUrl: './custom-segmentation.component.html',
  styleUrls: ['./custom-segmentation.component.styl']
})
export class CustomSegmentationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
