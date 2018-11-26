import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-promotions',
  templateUrl: './add-promotions.component.html',
  styleUrls: ['./add-promotions.component.styl']
})
export class AddPromotionsComponent implements OnInit, OnDestroy {

  private isActive: boolean;

  public isLoader: boolean;

  constructor() { }

  ngOnInit(): void {
    this.isActive = true;
    this.isLoader = true;
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
