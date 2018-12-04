import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddPromotionsCodsService } from '../../../page/promotions/add-promotions-cods/add-promotions-cods.service';
import { IPromoCod } from '../../../interface/ipromo-cod';
import { takeWhile } from 'rxjs/operators';

@Component( {
  selector: 'app-dialog-promo-cod',
  templateUrl: './dialog-promo-cod.component.html',
  styleUrls: [ './dialog-promo-cod.component.styl' ]
} )
export class DialogPromoCodComponent implements OnInit {

  public promoCods: IPromoCod;
  public formPromoCod: FormGroup;

  private isActive: boolean;

  constructor(
    private fb: FormBuilder,
    private addPromotionsCodsService: AddPromotionsCodsService,
    public dialogRef: MatDialogRef<DialogPromoCodComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: any
  ) { }

  ngOnInit(): void {
    console.log( this.data.params );
    this.isActive = true;
    this.initForm();
    this.initPromoCods();
  }

  private initPromoCods() {
    const params = {
      from: 0,
      count: 10000
    };
    this.addPromotionsCodsService.getAllPromoCodes( params )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( promoCods: IPromoCod ) => this.promoCods = promoCods );
  }

  private initForm() {
    this.formPromoCod = this.fb.group( {
      promoCodeId: '',
    } );
  }

  saveForm(): void {

  }

}
