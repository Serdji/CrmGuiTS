import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TableAsyncService } from '../../../services/table-async.service';
import { MatDialog } from '@angular/material/dialog';
import { takeWhile } from 'rxjs/operators';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { timer } from 'rxjs';
import { ProfileSmsDistributionService } from './profile-sms-distribution.service';
import { IpagPage } from '../../../interface/ipag-page';
import { IDistributionProfile } from '../../../interface/idistribution-profile';
import * as R from 'ramda';
import { DistributionService } from '../distribution.service';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-profile-sms-distribution',
  templateUrl: './profile-sms-distribution.component.html',
  styleUrls: ['./profile-sms-distribution.component.styl']
})
export class ProfileSmsDistributionComponent implements OnInit, OnDestroy {

  public isLoader: boolean;
  public isDistributionProfile: boolean;
  public startButtonDisabled: boolean;
  public stopButtonDisabled: boolean;
  public deleteButtonDisabled: boolean;
  public distributionProfile: IDistributionProfile;



  private smsProfileId: number;

  constructor(
    private route: ActivatedRoute,
    private tableAsyncService: TableAsyncService,
    private dialog: MatDialog,
    private distributionService: DistributionService,
    private profileSmsDistributionService: ProfileSmsDistributionService,
  ) { }

  ngOnInit(): void {

    this.isLoader = true;
    this.isDistributionProfile = false;
    this.initQueryParams();
    this.initTableProfilePagination();
    this.distributionService.distributionSubject
      .pipe( untilDestroyed(this) )
      .subscribe( _ => {
        this.stopButtonDisabled = true;

        this.isLoader = true;
        this.initTableProfile( this.smsProfileId );
      } );
  }

  private initQueryParams() {
    this.route.params
      .pipe( untilDestroyed(this) )
      .subscribe( params => {
        if ( params.id ) {
          this.smsProfileId = +params.id;
          this.initTableProfile( this.smsProfileId );
        }
      } );
  }

  private initTableProfilePagination() {
    this.tableAsyncService.subjectPage
      .pipe( untilDestroyed(this) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;
        const paramsAndCount = {
          distributionId: this.smsProfileId,
          from: pageIndex,
          count: value.pageSize
        };
        this.profileSmsDistributionService.getProfileDistribution( paramsAndCount )
          .pipe( untilDestroyed(this) )
          .subscribe( ( distributionProfile: IDistributionProfile ) => this.tableAsyncService.setTableDataSource( distributionProfile.customers ) );
      } );
  }


  private initTableProfile( id: number ) {
    const params = {
      distributionId: id,
      from: 0,
      count: 10
    };
    this.profileSmsDistributionService.getProfileDistribution( params )
      .pipe( untilDestroyed(this) )
      .subscribe( ( distributionProfile: IDistributionProfile ) => {
        if ( distributionProfile ) {
          this.tableAsyncService.countPage = distributionProfile.totalCount;
          this.distributionProfile = distributionProfile;
          if( !R.isNil( this.distributionProfile.customers ) ) this.isDistributionProfile = true;
          this.isLoader = false;
          this.disabledButton( distributionProfile );
        }
      } );
  }

  private disabledButton( distributionProfile: IDistributionProfile ) {

    switch ( distributionProfile.status.distributionStatusId ) {
      case 1:
        this.startButtonDisabled = false;
        this.stopButtonDisabled = true;
        this.deleteButtonDisabled = false;
        break;
      case 2:
      case 3:
        this.startButtonDisabled = true;
        this.stopButtonDisabled = false;
        this.deleteButtonDisabled = true;
        break;
      case 5:
        this.startButtonDisabled = true;
        this.stopButtonDisabled = true;
        this.deleteButtonDisabled = true;
        break;
      default:
        this.startButtonDisabled = true;
        this.stopButtonDisabled = true;
        this.deleteButtonDisabled = true;
    }
  }

  private windowDialog( messDialog: string, status: string, card: string = '', params: any = '' ) {
    this.dialog.open( DialogComponent, {
      data: {
        message: messDialog,
        status,
        card,
        params
      },
    } );
    if ( status === 'ok' ) {
      timer( 1500 )
        .pipe( untilDestroyed(this) )
        .subscribe( _ => {
          this.dialog.closeAll();
        } );
    }
  }

  startSmsDistribution(): void {
    this.windowDialog('DIALOG.DISTRIBUTION.SEND_SMS_DISTRIBUTION', 'startSmsDistribution', 'startSmsDistribution', this.distributionProfile.distributionId );
    this.startButtonDisabled = true;
    this.stopButtonDisabled = false;
  }

  stopSmsDistribution(): void {
    this.windowDialog( 'DIALOG.DISTRIBUTION.CANCEL_SMS_DISTRIBUTION', 'delete', 'stopSmsDistribution', this.distributionProfile.distributionId );
  }

  deleteSmsDistribution(): void {
    this.windowDialog( 'DIALOG.DISTRIBUTION.DELETE_SMS_DISTRIBUTION', 'delete', 'deleteSmsDistribution', this.distributionProfile.distributionId );
  }

  ngOnDestroy(): void {}

}
