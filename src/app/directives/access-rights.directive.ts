import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appAccessRights]'
})
export class AccessRightsDirective implements OnInit {

  @Input() appAccessRights: string;

  constructor( private elem: ElementRef ) { }

  ngOnInit() {
    // this.elem.nativeElement.remove();
  }

}
