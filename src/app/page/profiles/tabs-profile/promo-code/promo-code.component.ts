import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { IPromoCode } from '../../../../interface/ipromo-code';
import { PromoCodeService } from './promo-code.service';
import { takeWhile } from 'rxjs/operators';

@Component( {
  selector: 'app-promo-code',
  templateUrl: './promo-code.component.html',
  styleUrls: [ './promo-code.component.styl' ]
} )
export class PromoCodeComponent implements OnInit, OnDestroy {

  @Input() id: number;

  public progress: boolean;
  public promoCodes: IPromoCode;

  private isActive: boolean;

  constructor( private promoCodeService: PromoCodeService ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.progress = true;
    this.initPromoCodes();
  }

  private initPromoCodes() {
    this.promoCodeService.getPromoCodes( { 'customerId': this.id } )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( promoCodes: IPromoCode ) => {
        this.promoCodes = promoCodes;
        this.progress = false;
      } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
