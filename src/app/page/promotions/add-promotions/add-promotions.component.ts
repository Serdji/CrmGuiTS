import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddPromotionsService } from './add-promotions.service';
import { takeWhile } from 'rxjs/operators';

@Component( {
  selector: 'app-add-promotions',
  templateUrl: './add-promotions.component.html',
  styleUrls: [ './add-promotions.component.styl' ]
} )
export class AddPromotionsComponent implements OnInit, OnDestroy {

  public isLoader: boolean;
  public formPromotions: FormGroup;

  private isActive: boolean;

  constructor(
    private fb: FormBuilder,
    private addPromotionsService: AddPromotionsService
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.isLoader = true;
    this.initForm();
  }

  private initForm() {
    this.formPromotions = this.fb.group( {
      promotionName: ''
    } );
  }

  saveForm(): void {
    this.addPromotionsService.saveSegmentation( this.formPromotions.getRawValue() )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}














