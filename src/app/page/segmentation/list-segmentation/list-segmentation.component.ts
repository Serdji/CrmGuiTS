import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListSegmentationService } from './list-segmentation.service';
import { takeWhile } from 'rxjs/operators';
import { ISegmentation } from '../../../interface/isegmentation';
import { timer } from 'rxjs/observable/timer';
import { IpagPage } from '../../../interface/ipag-page';
import { ISegmentationProfile } from '../../../interface/isegmentation-profile';
import { TableAsyncService } from '../../../services/table-async.service';
import { AddSegmentationService } from '../add-segmentation/add-segmentation.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as R from 'ramda';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component( {
  selector: 'app-list-segmentation',
  templateUrl: './list-segmentation.component.html',
  styleUrls: [ './list-segmentation.component.styl' ]
} )
export class ListSegmentationComponent implements OnInit, OnDestroy {

  public segmentation: ISegmentation[];
  public isLoaderSegmentationTable: boolean;
  public isLoaderProfileTable: boolean;
  public isTableProfileTable: boolean;
  public segmentationProfiles: ISegmentationProfile;

  private segmentationId: number;


  constructor(
    private listSegmentationService: ListSegmentationService,
    private tableAsyncService: TableAsyncService,
    private addSegmentationService: AddSegmentationService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.isLoaderSegmentationTable = true;
    this.isLoaderProfileTable = true;
    this.isTableProfileTable = false;
    this.initSegmentation();
    this.initTableProfilePagination();
    this.initQueryParams();
    this.listSegmentationService.subjectSegmentations
      .pipe( untilDestroyed(this) )
      .subscribe( _ => this.refreshSegmentation() );
  }

  private refreshSegmentation() {
    timer( 100 )
      .pipe( untilDestroyed(this) )
      .subscribe( _ => {
        this.isLoaderSegmentationTable = true;
        this.initSegmentation();
      } );
  }

  private initQueryParams() {
    this.route.queryParams
      .pipe( untilDestroyed(this) )
      .subscribe( res => {
        const isRes = !R.isEmpty( res );
        if ( isRes ) {
          this.initTableProfile( res.segmentationId );
          this.segmentationId = res.segmentationId;
        }
        this.isTableProfileTable = isRes;
        this.isLoaderProfileTable = isRes;
      } );
  }

  private initSegmentation() {
    this.listSegmentationService.getSegmentation()
      .pipe( untilDestroyed(this) )
      .subscribe( segmentation => {
        this.segmentation = segmentation;
        this.isLoaderSegmentationTable = false;
      } );
  }

  private initTableProfilePagination() {
    this.tableAsyncService.subjectPage
      .pipe( untilDestroyed(this) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;
        const paramsAndCount = {
          'segmentationId': this.segmentationId,
          from: pageIndex,
          count: value.pageSize
        };
        this.addSegmentationService.getProfiles( paramsAndCount )
          .pipe( untilDestroyed(this) )
          .subscribe( ( segmentationProfiles: ISegmentationProfile ) => this.tableAsyncService.setTableDataSource( segmentationProfiles.customers ) );
      } );
  }

  private initTableProfile( id: number ) {
    const params = {
      segmentationId: id,
      from: 0,
      count: 10
    };
    this.addSegmentationService.getProfiles( params )
      .pipe( untilDestroyed(this) )
      .subscribe( ( segmentationProfiles: ISegmentationProfile ) => {
        this.tableAsyncService.countPage = segmentationProfiles.totalCount;
        this.segmentationProfiles = segmentationProfiles;
        this.isLoaderProfileTable = false;
      } );
  }


  onProfileSearch( segmentationId: number ): void {
    this.segmentationId = segmentationId;
    this.isTableProfileTable = true;
    this.isLoaderProfileTable = true;
    this.router.navigate( [ 'crm/list-segmentation' ], { queryParams: { segmentationId } } );
    this.initTableProfile( this.segmentationId );
  }

  ngOnDestroy(): void {}

}
