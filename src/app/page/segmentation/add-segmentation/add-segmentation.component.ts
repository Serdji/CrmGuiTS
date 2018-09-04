import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-add-segmentation',
  templateUrl: './add-segmentation.component.html',
  styleUrls: ['./add-segmentation.component.styl']
})
export class AddSegmentationComponent implements OnInit, OnDestroy {

  private isActive: boolean;
  public formProfileSearch: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.initFormProfileSearch();
  }

  private initFormProfileSearch() {
    this.formProfileSearch = this.fb.group({});
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
