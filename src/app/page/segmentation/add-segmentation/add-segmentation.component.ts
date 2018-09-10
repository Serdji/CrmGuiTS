import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { AddSegmentationService } from './add-segmentation.service';
import { ISegmentationProfile } from '../../../interface/isegmentation-profile';

@Component( {
  selector: 'app-add-segmentation',
  templateUrl: './add-segmentation.component.html',
  styleUrls: [ './add-segmentation.component.styl' ]
} )
export class AddSegmentationComponent implements OnInit, OnDestroy {

  public formSegmentation: FormGroup;
  public buttonSave: boolean;
  public buttonCreate: boolean;
  public buttonSearch: boolean;
  public isLoader: boolean;
  public isTable: boolean;
  public segmentationProfiles: ISegmentationProfile;

  private isActive: boolean;
  private profileId: number;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private addSegmentationService: AddSegmentationService
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.buttonSave = false;
    this.buttonCreate = true;
    this.buttonSearch = true;
    this.isLoader = true;
    this.isTable = false;

    this.initFormSegmentation();
    this.initQueryParams();
  }

  private initQueryParams() {
    this.route.queryParams
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( params => {
        if ( params.id ) {
          this.buttonSave = true;
          this.buttonCreate = false;
          this.buttonSearch = false;
          this.profileId = +params.id;
        }
      } );
  }

  private initFormSegmentation() {
    this.formSegmentation = this.fb.group( {
      segmentationName: ''
    } );
  }

  private initTableProfile( id: number ) {
    this.addSegmentationService.getProfiles( id ).subscribe( segmentationProfiles => {
      this.segmentationProfiles = segmentationProfiles;
      this.isLoader = false;
    } );
  }

  saveForm(): void {
    const segmentationParameters = {
      segmentationName: this.formSegmentation.get( 'segmentationName' ).value
    };

    console.log( segmentationParameters );
  }

  searchForm(): void {
    this.isTable = true;
    this.initTableProfile( this.profileId );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
