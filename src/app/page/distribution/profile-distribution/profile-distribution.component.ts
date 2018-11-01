import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileDistributionService } from './profile-distribution.service';
import { takeWhile } from 'rxjs/operators';
import { IdistributionProfile } from '../../../interface/idistribution-profile';

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
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.isLoader = true;
    this.initQueryParams();
  }

  private initQueryParams() {
    this.route.params
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( params => {
        if ( params.id ) {
          console.log(params.id);
          this.distributionProfileId = +params.id;
          this.initTableProfile( this.distributionProfileId  );
        }
      } );
  }


  private initTableProfile( id: number ) {
    const params = {
      segmentationId: id,
      from: 0,
      count: 10
    };
    this.profileDistributionService.getProfileDistribution( params )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( distributionProfile: IdistributionProfile ) => {
        this.distributionProfile = distributionProfile;
        this.isLoader = false;
      } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
