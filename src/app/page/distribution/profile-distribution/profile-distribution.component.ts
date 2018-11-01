import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileDistributionService } from './profile-distribution.service';

@Component({
  selector: 'app-profile-distribution',
  templateUrl: './profile-distribution.component.html',
  styleUrls: ['./profile-distribution.component.styl']
})
export class ProfileDistributionComponent implements OnInit, OnDestroy {

  public isLoader: boolean;

  private isActive: boolean;

  constructor(
    private route: ActivatedRoute,
    private profileDistributionService: ProfileDistributionService,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.isLoader = true;
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
