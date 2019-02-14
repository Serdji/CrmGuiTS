import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-distribution-report',
  templateUrl: './distribution-report.component.html',
  styleUrls: ['./distribution-report.component.styl']
})
export class DistributionReportComponent implements OnInit, OnDestroy {

  private isActive: boolean;

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.isActive = true;
    this.firstFormGroup = this.fb.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.fb.group({
      secondCtrl: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
