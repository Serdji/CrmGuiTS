import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ParsTokenService } from '../services/pars-token.service';
import { Itoken } from '../interface/itoken';
import { timer } from 'rxjs/observable/timer';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { takeWhile } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Injectable( {
  providedIn: 'root',
} )
export class AccessRightsDistributionGuard implements CanActivate, OnInit, OnDestroy {

  private token: Itoken = JSON.parse( localStorage.getItem( 'paramsToken' ) );


  constructor(
    private parsTokenService: ParsTokenService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    this.parsTokenService.parsToken = this.token.accessToken;
    const claims = this.parsTokenService.parsToken.Claims;
    return new Promise( resolve => {
      if ( claims.includes( 'distributions:read' ) ) {
        resolve( true );
      } else {
        this.dialog.open( DialogComponent, {
          data: {
            message: 'У Вас недостаточно прав на это действие!',
            status: 'error',
          },
        } );
        timer( 1500 )
          .pipe( untilDestroyed(this) )
          .subscribe( _ => {
            this.dialog.closeAll();
          } );
        resolve( false );
      }
    } );
  }

  ngOnDestroy(): void {}
}
