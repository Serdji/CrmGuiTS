import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumbersOnly]'
})
export class NumbersOnlyDirective {

  @Input('appNumbersOnly') typeNumber: string;

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    if( this.typeNumber === 'int' ) this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
    if( this.typeNumber === 'float' ) this._el.nativeElement.value = initalValue.replace(/[^-\d+\.,\d+]/g, '');
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
