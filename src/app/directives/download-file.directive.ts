import { Directive, OnInit, Input, Renderer2 } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Directive( {
  selector: '[appDownloadFile]'
} )
export class DownloadFileDirective {

  constructor( private renderer: Renderer2 ) { }

  @Input() set appDownloadFile( resp: HttpResponse<any> ) {
    if ( resp ) {
      const link = this.renderer.createElement( 'a' );
      const filename = resp.headers.get( 'content-disposition' ).split( ';' )[ 1 ].split( '=' )[ 1 ];
      this.renderer.setAttribute( link, 'href', window.URL.createObjectURL( resp.body ) );
      this.renderer.setAttribute( link, 'download', filename );
      this.renderer.setStyle( link, 'display', 'none' );
      link.click();
    }
  }

}
