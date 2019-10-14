import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TableAsyncService } from '../../../services/table-async.service';
import { MatDialog } from '@angular/material/dialog';
import { takeWhile } from 'rxjs/operators';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { timer } from 'rxjs';

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
  public deliteButtonDisabled: boolean;


  private isActive: boolean;
  private smsProfileId: number;

  constructor(
    private route: ActivatedRoute,
    private tableAsyncService: TableAsyncService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.isLoader = false;
    this.isDistributionProfile = false;
    this.initQueryParams();
  }

  private initQueryParams() {
    this.route.params
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( params => {
        if ( params.id ) {
          this.smsProfileId = +params.id;
          console.log( this.smsProfileId );
        }
      } );
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

  startDistribution(): void {
    // this.windowDialog(
    //   `По результатам реализации данной отправки лимит сообщений ${this.emailLimits - this.distributionProfile.totalCount}. ` +
    //   `Подтвердите активацию сохраненной рассылки в количестве ${this.distributionProfile.totalCount} писем ?`,
    //   'startDistribution',
    //   'startDistribution',
    //   this.distributionProfile.distributionId
    // );
    console.log( this.smsProfileId );
    this.startButtonDisabled = true;
    this.stopButtonDisabled = false;
  }

  stopDistribution(): void {
    // this.windowDialog( 'DIALOG.DELETE.CANCEL_SMS_DISTRIBUTION', 'delete', 'stopDistribution', this.distributionProfile.distributionId );
  }

  deleteDistribution(): void {
    // this.windowDialog( 'DIALOG.DELETE.SMS_DISTRIBUTION', 'delete', 'deleteDistribution', this.distributionProfile.distributionId );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
