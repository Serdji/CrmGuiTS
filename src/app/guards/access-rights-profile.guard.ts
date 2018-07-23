import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ParsTokenService } from '../services/pars-token.service';
import { Itoken } from '../interface/itoken';
import { MatDialog } from '@angular/material';
import { timer } from 'rxjs/observable/timer';
import { DialogComponent } from '../shared/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AccessRightsProfileGuard implements CanActivate {
  private token: Itoken = JSON.parse( localStorage.getItem( 'paramsToken' ) );

  constructor(
    private parsTokenService: ParsTokenService,
    private dialog: MatDialog,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    this.parsTokenService.parsToken = this.token.accessToken;
    const claims = this.parsTokenService.parsToken.Claims;
    return new Promise( resolve => {
      if ( claims.includes( 'customers:update' ) ) {
        resolve( true );
      } else {
        this.dialog.open( DialogComponent, {
          data: {
            message: 'У Вас недостаточно прав на это действие!',
            status: 'error',
          },
        } );
        timer( 1500 ).subscribe( _ => {
            this.dialog.closeAll();
          } );
        resolve( false );
      }
    } );
  }
}
