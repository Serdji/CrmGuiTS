import { Component, OnDestroy, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-promo-code',
  templateUrl: './promo-code.component.html',
  styleUrls: ['./promo-code.component.styl']
})
export class PromoCodeComponent implements OnInit, OnDestroy {

  @Input() id: number;

  private isActive: boolean;

  constructor() { }

  ngOnInit(): void {
    this.isActive = true;
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
