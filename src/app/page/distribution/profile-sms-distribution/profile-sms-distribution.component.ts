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


  private isActive: boolean;
  private smsProfileId: number;

  constructor(
    private route: ActivatedRoute,
    private tableAsyncService: TableAsyncService,
    private dialog: MatDialog,
    private distributionService: DistributionService,
    private profileSmsDistributionService: ProfileSmsDistributionService,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.isLoader = true;
    this.isDistributionProfile = false;
    this.initQueryParams();
    this.initTableProfilePagination();
    this.distributionService.distributionSubject
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        this.stopButtonDisabled = true;
        this.isActive = true;
        this.isLoader = true;
      } );
  }

  private initQueryParams() {
    this.route.params
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( params => {
        if ( params.id ) {
          this.smsProfileId = +params.id;
          this.initTableProfile( this.smsProfileId );
        }
      } );
  }

  private initTableProfilePagination() {
    this.tableAsyncService.subjectPage
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;
        const paramsAndCount = {
          distributionId: this.smsProfileId,
          from: pageIndex,
          count: value.pageSize
        };
        this.profileSmsDistributionService.getProfileDistribution( paramsAndCount )
          .pipe( takeWhile( _ => this.isActive ) )
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
      .pipe( takeWhile( _ => this.isActive ) )
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
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( _ => {
          this.dialog.closeAll();
        } );
    }
  }

  startSmsDistribution(): void {
    this.windowDialog('DIALOG.DISTRIBUTION.SEND_DISTRIBUTION','startSmsDistribution','startSmsDistribution', this.smsProfileId );
    this.startButtonDisabled = true;
    this.stopButtonDisabled = false;
  }

  stopSmsDistribution(): void {
    this.windowDialog( 'DIALOG.DISTRIBUTION.CANCEL_SMS_DISTRIBUTION', 'delete', 'stopSmsDistribution', this.smsProfileId );
  }

  deleteSmsDistribution(): void {
    this.windowDialog( 'DIALOG.DISTRIBUTION.SMS_DISTRIBUTION', 'delete', 'deleteSmsDistribution', this.smsProfileId );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
