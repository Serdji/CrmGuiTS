import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-promotions-cods',
  templateUrl: './add-promotions-cods.component.html',
  styleUrls: ['./add-promotions-cods.component.styl']
})
export class AddPromotionsCodsComponent implements OnInit, OnDestroy {

  private isActive: boolean;

  public isLoader: boolean;

  constructor() { }

  ngOnInit(): void {
    this.isActive = true;
    this.isLoader = true;
  }

  saveForm(): void {

  }

  clearForm(): void {

  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
