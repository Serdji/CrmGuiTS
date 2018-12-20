import { Component, OnDestroy, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-promo-code',
  templateUrl: './promo-code.component.html',
  styleUrls: ['./promo-code.component.styl']
})
export class PromoCodeComponent implements OnInit, OnDestroy {

  @Input() id: number;

  public progress: boolean;

  private isActive: boolean;

  constructor() { }

  ngOnInit(): void {
    this.isActive = true;
    this.progress = false;
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
