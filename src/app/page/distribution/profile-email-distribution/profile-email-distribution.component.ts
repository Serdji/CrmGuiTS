import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileEmailDistributionService } from './profile-email-distribution.service';
import { takeWhile } from 'rxjs/operators';
import { IdistributionProfile } from '../../../interface/idistribution-profile';
import { IpagPage } from '../../../interface/ipag-page';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { timer } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TableAsyncService } from '../../../services/table-async.service';
import * as R from 'ramda';
import { EditorEmailService } from '../../../components/editors/editor-email/editor-email.service';

@Component( {
  selector: 'app-profile-email-distribution',
  templateUrl: './profile-email-distribution.component.html',
  styleUrls: [ './profile-email-distribution.component.styl' ]
} )
export class ProfileEmailDistributionComponent implements OnInit, OnDestroy {

  public isLoader: boolean;
  public isDistributionProfile: boolean;
  public distributionProfile: IdistributionProfile;
  public startButtonDisabled: boolean;
  public stopButtonDisabled: boolean;
  public deleteButtonDisabled: boolean;

  private emailLimits: number;
  private isActive: boolean;
  private distributionProfileId: number;

  constructor(
    private route: ActivatedRoute,
    private profileEmailDistributionService: ProfileEmailDistributionService,
    private tableAsyncService: TableAsyncService,
    private dialog: MatDialog,
    private editorEmailService: EditorEmailService,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.isLoader = true;
    this.isDistributionProfile = false;
    this.initQueryParams();
    this.initTableProfilePagination();
    this.initEmailLimits();
    this.profileEmailDistributionService.profileEmailDistributionSubject
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        this.stopButtonDisabled = true;
        this.isActive = true;
        this.isLoader = true;
        this.initTableProfile( this.distributionProfileId );
      } );
  }

  private initQueryParams() {
    this.route.params
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( params => {
        if ( params.id ) {
          this.distributionProfileId = +params.id;
          this.initTableProfile( this.distributionProfileId );
        }
      } );
  }


  private initTableProfilePagination() {
    this.tableAsyncService.subjectPage
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;
        const paramsAndCount = {
          distributionId: this.distributionProfileId,
          from: pageIndex,
          count: value.pageSize
        };
        this.profileEmailDistributionService.getProfileDistribution( paramsAndCount )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( ( distributionProfile: IdistributionProfile ) => this.tableAsyncService.setTableDataSource( distributionProfile.customers ) );
      } );
  }


  private initTableProfile( id: number ) {
    const params = {
      distributionId: id,
      from: 0,
      count: 10
    };
    this.profileEmailDistributionService.getProfileDistribution( params )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( distributionProfile: IdistributionProfile ) => {
        if ( distributionProfile ) {
          this.tableAsyncService.countPage = distributionProfile.totalCount;
          this.distributionProfile = distributionProfile;
          if( !R.isNil( this.distributionProfile.customers ) ) this.isDistributionProfile = true;
          this.isLoader = false;
          this.disabledButton( distributionProfile );
        }
      } );
  }


  private initEmailLimits() {
    this.editorEmailService.getEmailLimits()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( emailLimits => {
        this.emailLimits = emailLimits;
      } );
  }

  private disabledButton( distributionProfile: IdistributionProfile ) {

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

  startEmailDistribution(): void {
    this.windowDialog(
      `По результатам реализации данной отправки лимит сообщений ${this.emailLimits - this.distributionProfile.totalCount}. ` +
      `Подтвердите активацию сохраненной рассылки в количестве ${this.distributionProfile.totalCount} писем ?`,
      'startEmailDistribution',
      'startEmailDistribution',
      this.distributionProfile.distributionId
    );
    this.startButtonDisabled = true;
    this.stopButtonDisabled = false;
  }

  stopEmailDistribution(): void {
    this.windowDialog( 'DIALOG.DISTRIBUTION.CANCEL_EMAIL_DISTRIBUTION', 'delete', 'stopEmailDistribution', this.distributionProfile.distributionId );
  }

  deleteEmailDistribution(): void {
    this.windowDialog( 'DIALOG.DISTRIBUTION.EMAIL_DISTRIBUTION', 'delete', 'deleteEmailDistribution', this.distributionProfile.distributionId );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
