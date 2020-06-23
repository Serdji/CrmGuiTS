import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumbersOnly]'
})
export class NumbersOnlyDirective {

  @Input('appNumbersOnly') typeNumber: 'int' | 'float';

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initValue = this._el.nativeElement.value;
    if( this.typeNumber === 'int' ) this._el.nativeElement.value = initValue.replace(/[^0-9]*/g, '');
    if( this.typeNumber === 'float' ) this._el.nativeElement.value = initValue.replace(/[^-\d+\.,\d+]/g, '');
    if ( initValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
