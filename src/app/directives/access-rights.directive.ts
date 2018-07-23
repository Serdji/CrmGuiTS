import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { ParsTokenService } from '../services/pars-token.service';
import { Itoken } from '../interface/itoken';
import { log } from 'util';

@Directive( {
  selector: '[appAccessRights]'
} )
export class AccessRightsDirective implements OnInit {

  @Input() appAccessRights: string;
  @Input() appAccessMessage: boolean;

  private token: Itoken = JSON.parse( localStorage.getItem( 'paramsToken' ) );

  constructor(
    private elem: ElementRef,
    private renderer: Renderer2,
    private parsTokenService: ParsTokenService
  ) { }

  ngOnInit() {
    this.initIsRights();
  }

  private initIsRights() {
    this.parsTokenService.parsToken = this.token.accessToken;
    if ( this.parsTokenService.parsToken.Claims ) {
      const claims = this.parsTokenService.parsToken.Claims;
      if ( !claims.includes( this.appAccessRights ) ) {
        if ( this.appAccessMessage ) {

          while ( this.elem.nativeElement.firstChild ) {
            this.elem.nativeElement.removeChild( this.elem.nativeElement.firstChild );
          }

          const div = this.renderer.createElement( 'div' );
          const text = this.renderer.createText( 'У Вас недостаточно прав на это действие!' );

          this.renderer.setStyle(div, 'color', 'red');
          this.renderer.appendChild( div, text );
          this.renderer.appendChild( this.elem.nativeElement, div );
        } else {
          this.elem.nativeElement.remove();
        }
      }
    }
  }

}
