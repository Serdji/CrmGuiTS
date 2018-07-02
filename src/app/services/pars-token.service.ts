import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IparsToken } from '../interface/ipars-token';


@Injectable( {
  providedIn: 'root'
} )
export class ParsTokenService {

  private helper = new JwtHelperService();

  constructor() { }

  getParsToken( myRawToken: string ): IparsToken {
    return this.helper.decodeToken( myRawToken );
  }

}
