import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddPromotionsService } from './add-promotions.service';
import { takeWhile } from 'rxjs/operators';
import { TabletAsyncPromotionsService } from '../../../components/tables/tablet-async-promotions/tablet-async-promotions.service';
import { IPromotions } from '../../../interface/ipromotions';
import { IpagPage } from '../../../interface/ipag-page';
import { timer } from 'rxjs';

@Component( {
  selector: 'app-add-promotions',
  templateUrl: './add-promotions.component.html',
  styleUrls: [ './add-promotions.component.styl' ]
} )
export class AddPromotionsComponent implements OnInit, OnDestroy {

  public isLoader: boolean;
  public formPromotions: FormGroup;
  public promotions: IPromotions;

  private isActive: boolean;

  constructor(
    private fb: FormBuilder,
    private addPromotionsService: AddPromotionsService,
    private tabletAsyncPromotionsService: TabletAsyncPromotionsService
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.isLoader = true;
    this.initForm();
    this.initTablePromotions();
    this.initTablePromotionsPagination();
    this.addPromotionsService.subjectDeletePromotions
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        this.isLoader = true;
        timer( 300 )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( _ => this.initTablePromotions() );
      } );
  }

  private initForm() {
    this.formPromotions = this.fb.group( {
      promotionName: ''
    } );
  }

  private initTablePromotionsPagination() {
    this.tabletAsyncPromotionsService.subjectPage
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;
        const paramsAndCount = {
          from: pageIndex,
          count: value.pageSize
        };
        this.addPromotionsService.getAllPromotions( paramsAndCount )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( ( promotions: IPromotions ) => this.tabletAsyncPromotionsService.setTableDataSource( promotions.result ) );
      } );
  }

  private initTablePromotions() {
    const params = {
      from: 0,
      count: 10
    };
    this.addPromotionsService.getAllPromotions( params )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( promotions: IPromotions ) => {
        this.tabletAsyncPromotionsService.countPage = promotions.totalCount;
        this.promotions = promotions;
        this.isLoader = false;
      } );
  }

  saveForm(): void {
    this.isLoader = true;
    this.addPromotionsService.savePromotions( this.formPromotions.getRawValue() )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        this.formPromotions.get( 'promotionName' ).patchValue('');
        this.initTablePromotions();
      } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}














