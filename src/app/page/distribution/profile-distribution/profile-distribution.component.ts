import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileDistributionService } from './profile-distribution.service';
import { takeWhile } from 'rxjs/operators';
import { IdistributionProfile } from '../../../interface/idistribution-profile';
import { TabletAsyncDistributionProfileService } from '../../../components/tables/tablet-async-distribution-profile/tablet-async-distribution-profile.service';
import { IpagPage } from '../../../interface/ipag-page';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { timer } from 'rxjs';
import { MatDialog } from '@angular/material';
import { EditorService } from '../../../components/editors/editor/editor.service';

@Component( {
  selector: 'app-profile-distribution',
  templateUrl: './profile-distribution.component.html',
  styleUrls: [ './profile-distribution.component.styl' ]
} )
export class ProfileDistributionComponent implements OnInit, OnDestroy {

  public isLoader: boolean;
  public distributionProfile: IdistributionProfile;
  public startButtonDisabled: boolean;
  public stopButtonDisabled: boolean;

  private emailLimits: number;
  private isActive: boolean;
  private distributionProfileId: number;

  constructor(
    private route: ActivatedRoute,
    private profileDistributionService: ProfileDistributionService,
    private tabletAsyncDistributionProfileService: TabletAsyncDistributionProfileService,
    private dialog: MatDialog,
    private editorService: EditorService,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.isLoader = true;
    this.initQueryParams();
    this.initTableProfilePagination();
    this.initEmailLimits();
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
        this.disabledButton( distributionProfile );
      } );
  }

  private initEmailLimits() {
    this.editorService.getEmailLimits()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( emailLimits => {
        this.emailLimits = emailLimits;
      } );
  }

  private disabledButton( distributionProfile ) {

    switch ( distributionProfile.status.distributionStatusId ) {
      case 1:
        this.startButtonDisabled = false;
        this.stopButtonDisabled = true;
        break;
      case 2 || 3 || 5:
        this.startButtonDisabled = true;
        this.stopButtonDisabled = false;
        break;
      default:
        this.startButtonDisabled = true;
        this.stopButtonDisabled = true;
        break;
    }
  }

  private windowDialog( messDialog: string, status: string, params: any = '' ) {
    this.dialog.open( DialogComponent, {
      data: {
        message: messDialog,
        status,
        card: status,
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
    this.windowDialog(
      `По результатам реализации данной отправки лимит сообщений ${ this.emailLimits - this.distributionProfile.totalCount }. ` +
      `Подтвердите активацию сохраненной рассылки в количестве ${ this.distributionProfile.totalCount } писем ?`,
      'sendDistribution',
      this.distributionProfile.distributionId
    );
    this.startButtonDisabled = true;
    this.stopButtonDisabled = false;
  }

  stopDistribution(): void {
    this.editorService.stopDistribution( this.distributionProfile.distributionId )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        this.stopButtonDisabled = true;
        this.windowDialog( 'Рассылка остановлена', 'ok' );
      } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
