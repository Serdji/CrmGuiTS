import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-sms-distribution',
  templateUrl: './profile-sms-distribution.component.html',
  styleUrls: ['./profile-sms-distribution.component.styl']
})
export class ProfileSmsDistributionComponent implements OnInit, OnDestroy {

  private isActive: boolean;

  constructor() { }

  ngOnInit(): void {
    this.isActive = true;
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
