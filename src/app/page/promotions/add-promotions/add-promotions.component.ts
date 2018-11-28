import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddPromotionsService } from './add-promotions.service';
import { takeWhile } from 'rxjs/operators';
import { TabletAsyncPromotionsService } from '../../../components/tables/tablet-async-promotions/tablet-async-promotions.service';
import { IPromotions } from '../../../interface/ipromotions';
import { IpagPage } from '../../../interface/ipag-page';

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
    this.initTableProfile();
    this.initTableProfilePagination();
  }

  private initForm() {
    this.formPromotions = this.fb.group( {
      promotionName: ''
    } );
  }

  private initTableProfilePagination() {
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
          .subscribe( ( promotions: IPromotions ) => this.tabletAsyncPromotionsService.setTableDataSource( promotions ) );
      } );
  }

  private initTableProfile() {
    const params = {
      from: 0,
      count: 10
    };
    this.addPromotionsService.getAllPromotions( params )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( promotions: IPromotions ) => {
        // this.tabletAsyncPromotionsService.countPage = promotions.totalCount;
        console.log(promotions);
        this.promotions = promotions;
        this.isLoader = false;
      } );
  }

  saveForm(): void {
    this.addPromotionsService.savePromotions( this.formPromotions.getRawValue() )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}














