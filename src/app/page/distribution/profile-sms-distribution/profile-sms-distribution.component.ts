import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TableAsyncService } from '../../../services/table-async.service';
import { MatDialog } from '@angular/material/dialog';
import { takeWhile } from 'rxjs/operators';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { timer } from 'rxjs';
import { ProfileSmsDistributionService } from './profile-sms-distribution.service';

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
    private profileSmsDistributionService: ProfileSmsDistributionService,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.isLoader = false;
    this.isDistributionProfile = false;
    this.initQueryParams();
    this.profileSmsDistributionService.profileSmsDistributionSubject
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        this.stopButtonDisabled = true;
        this.isActive = true;
        this.isLoader = true;
        console.log( 'test' );
      } );
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

  startSmsDistribution(): void {
    this.windowDialog('DIALOG.DISTRIBUTION.SEND_DISTRIBUTION','startSmsDistribution','startSmsDistribution', this.smsProfileId );
    this.startButtonDisabled = true;
    this.stopButtonDisabled = false;
  }

  stopSmsDistribution(): void {
    // this.windowDialog( 'DIALOG.DISTRIBUTION.CANCEL_SMS_DISTRIBUTION', 'delete', 'stopSmsDistribution', this.smsProfileId );
  }

  deleteSmsDistribution(): void {
    // this.windowDialog( 'DIALOG.DISTRIBUTION.SMS_DISTRIBUTION', 'delete', 'deleteSmsDistribution', this.smsProfileId );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
