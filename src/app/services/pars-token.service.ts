import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IparsToken } from '../interface/ipars-token';


@Injectable( {
  providedIn: 'root'
} )
export class ParsTokenService {

  private helper = new JwtHelperService();
  private decodeToken: IparsToken;

  constructor() { }

  set parsToken( myRawToken: any ) {
    this.decodeToken = this.helper.decodeToken( myRawToken );
  }

  get parsToken(): any {
    return this.decodeToken;
  }

}
