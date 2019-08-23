import { Injectable } from '@angular/core';
import { ParsTokenService } from './pars-token.service';
import { Itoken } from '../interface/itoken';

@Injectable( {
  providedIn: 'root'
} )
export class CheckTokenService {

  private token: Itoken = JSON.parse( localStorage.getItem( 'paramsToken' ) );

  constructor( private parsTokenService: ParsTokenService ) { }

  isClaims( rights: string ): boolean {
    this.parsTokenService.parsToken = this.token.accessToken;
    if ( !this.parsTokenService.parsToken.Claims ) return;
    const claims = this.parsTokenService.parsToken.Claims;
    return claims.includes( rights );
  }

}

