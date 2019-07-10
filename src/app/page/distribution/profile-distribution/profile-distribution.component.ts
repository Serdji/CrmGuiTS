import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileDistributionService } from './profile-distribution.service';
import { takeWhile } from 'rxjs/operators';
import { IdistributionProfile } from '../../../interface/idistribution-profile';
import { IpagPage } from '../../../interface/ipag-page';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { timer } from 'rxjs';
import { MatDialog } from '@angular/material';
import { EditorService } from '../../../components/editors/editor/editor.service';
import { TableAsyncService } from '../../../services/table-async.service';
import * as R from 'ramda';

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
  public deliteButtonDisabled: boolean;
  public isDistributionProfile: boolean;

  private emailLimits: number;
  private isActive: boolean;
  private distributionProfileId: number;

  constructor(
    private route: ActivatedRoute,
    private profileDistributionService: ProfileDistributionService,
    private tableAsyncService: TableAsyncService,
    private dialog: MatDialog,
    private editorService: EditorService,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.isLoader = true;
    this.isDistributionProfile = false;
    this.initQueryParams();
    this.initTableProfilePagination();
    this.initEmailLimits();
    this.profileDistributionService.profileDistributionSubject
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
        this.profileDistributionService.getProfileDistribution( paramsAndCount )
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
    this.profileDistributionService.getProfileDistribution( params )
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
    this.editorService.getEmailLimits()
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
        this.deliteButtonDisabled = false;
        break;
      case 2:
      case 3:
        this.startButtonDisabled = true;
        this.stopButtonDisabled = false;
        this.deliteButtonDisabled = true;
        break;
      case 5:
        this.startButtonDisabled = true;
        this.stopButtonDisabled = true;
        this.deliteButtonDisabled = true;
        break;
      default:
        this.startButtonDisabled = true;
        this.stopButtonDisabled = true;
        this.deliteButtonDisabled = true;
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

  startDistribution(): void {
    this.windowDialog(
      `По результатам реализации данной отправки лимит сообщений ${this.emailLimits - this.distributionProfile.totalCount}. ` +
      `Подтвердите активацию сохраненной рассылки в количестве ${this.distributionProfile.totalCount} писем ?`,
      'startDistribution',
      'startDistribution',
      this.distributionProfile.distributionId
    );
    this.startButtonDisabled = true;
    this.stopButtonDisabled = false;
  }

  stopDistribution(): void {
    this.windowDialog( 'Вы действительно хотиту отменить эту рассылку ?', 'delete', 'stopDistribution', this.distributionProfile.distributionId );
  }

  deleteDistribution(): void {
    this.windowDialog( 'Вы действительно хотиту удальть эту рассылку ?', 'delete', 'deleteDistribution', this.distributionProfile.distributionId );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
