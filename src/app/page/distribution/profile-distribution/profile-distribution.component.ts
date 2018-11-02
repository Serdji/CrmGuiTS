import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileDistributionService } from './profile-distribution.service';
import { takeWhile } from 'rxjs/operators';
import { IdistributionProfile } from '../../../interface/idistribution-profile';
import { TabletAsyncDistributionProfileService } from '../../../components/tables/tablet-async-distribution-profile/tablet-async-distribution-profile.service';
import { IpagPage } from '../../../interface/ipag-page';
import { ISegmentationProfile } from '../../../interface/isegmentation-profile';

@Component({
  selector: 'app-profile-distribution',
  templateUrl: './profile-distribution.component.html',
  styleUrls: ['./profile-distribution.component.styl']
})
export class ProfileDistributionComponent implements OnInit, OnDestroy {

  public isLoader: boolean;
  public distributionProfile: IdistributionProfile;

  private isActive: boolean;
  private distributionProfileId: number;

  constructor(
    private route: ActivatedRoute,
    private profileDistributionService: ProfileDistributionService,
    private tabletAsyncDistributionProfileService: TabletAsyncDistributionProfileService
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.isLoader = true;
    this.initQueryParams();
    this.initTableProfilePagination();
  }

  private initQueryParams() {
    this.route.params
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( params => {
        if ( params.id ) {
          this.distributionProfileId = +params.id;
          this.initTableProfile( this.distributionProfileId  );
        }
      } );
  }


  private initTableProfilePagination() {
    this.tabletAsyncDistributionProfileService.subjectPage
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;
        const paramsAndCount = {
          distributionId: this.distributionProfileId,
          from: pageIndex,
          count: value.pageSize
        };
        this.profileDistributionService.getProfileDistribution( paramsAndCount )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( ( distributionProfile: IdistributionProfile ) => this.tabletAsyncDistributionProfileService.setTableDataSource( distributionProfile.customers ) );
      } );
  }


  private initTableProfile( id: number ) {
    const params = {
      distributionId: id,
      from: 0,
      count: 10
    };
    this.profileDistributionService.getProfileDistribution( params )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( distributionProfile: IdistributionProfile ) => {
        this.tabletAsyncDistributionProfileService.countPage = distributionProfile.totalCount;
        this.distributionProfile = distributionProfile;
        this.isLoader = false;
      } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
