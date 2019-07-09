import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListSegmentationService } from './list-segmentation.service';
import { takeWhile } from 'rxjs/operators';
import { ISegmentation } from '../../../interface/isegmentation';
import { timer } from 'rxjs/observable/timer';
import { IpagPage } from '../../../interface/ipag-page';
import { ISegmentationProfile } from '../../../interface/isegmentation-profile';
import { TableAsyncService } from '../../../services/table-async.service';
import { AddSegmentationService } from '../add-segmentation/add-segmentation.service';

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
  private isActive: boolean;

  constructor(
    private listSegmentationService: ListSegmentationService,
    private tableAsyncService: TableAsyncService,
    private addSegmentationService: AddSegmentationService,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.isLoaderSegmentationTable = true;
    this.isLoaderProfileTable = true;
    this.isTableProfileTable = false;
    this.initSegmentation();
    this.initTableProfilePagination();
    this.listSegmentationService.subjectSegmentations
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => this.refreshSegmentation() );
  }

  private refreshSegmentation() {
    timer( 100 )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        this.isLoaderSegmentationTable = true;
        this.initSegmentation();
      } );
  }

  private initSegmentation() {
    this.listSegmentationService.getSegmentation()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( segmentation => {
        this.segmentation = segmentation;
        this.isLoaderSegmentationTable = false;
      } );
  }

  private initTableProfilePagination() {
    this.tableAsyncService.subjectPage
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;
        const paramsAndCount = {
          'segmentationId': this.segmentationId,
          from: pageIndex,
          count: value.pageSize
        };
        this.addSegmentationService.getProfiles( paramsAndCount )
          .pipe( takeWhile( _ => this.isActive ) )
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
      .pipe( takeWhile( _ => this.isActive ) )
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
    this.initTableProfile( this.segmentationId );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
