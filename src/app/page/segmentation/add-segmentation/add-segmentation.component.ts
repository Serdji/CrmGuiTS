import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { AddSegmentationService } from './add-segmentation.service';

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

    this.initFormSegmentation();
    this.formFilling();
  }

  private initProfile() {

  }

  private formFilling() {
    this.route.queryParams
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( params => {
        if ( params.id ) {
          this.buttonSave = true;
          this.buttonCreate = false;
          this.buttonSearch = false;

          this.profileId = +params.id;
          console.log( this.profileId );
          this.addSegmentationService.getProfiles( this.profileId ).subscribe( value => {
            console.log( value );
          } );
        }
      } );
  }

  private initFormSegmentation() {
    this.formSegmentation = this.fb.group( {
      segmentationName: '',
      123: ''
    } );
  }

  public saveForm(): void {
    const segmentationParameters = {
      segmentationName: this.formSegmentation.get( 'segmentationName' ).value
    };

    console.log( segmentationParameters );

  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
