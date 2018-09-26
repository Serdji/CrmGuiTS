import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ParsTokenService } from '../services/pars-token.service';
import { Itoken } from '../interface/itoken';
import { timer } from 'rxjs/observable/timer';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material';
import { takeWhile } from 'rxjs/operators';

@Injectable( {
  providedIn: 'root',
} )
export class AccessRightsUserGuard implements CanActivate, OnInit, OnDestroy {

  private token: Itoken = JSON.parse( localStorage.getItem( 'paramsToken' ) );
  private isActive: boolean;

  constructor(
    private parsTokenService: ParsTokenService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.isActive = true;
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    this.parsTokenService.parsToken = this.token.accessToken;
    const claims = this.parsTokenService.parsToken.Claims;
    return new Promise( resolve => {
      if ( claims.includes( 'users:update' ) ) {
        resolve( true );
      } else {
        this.dialog.open( DialogComponent, {
          data: {
            message: 'У Вас недостаточно прав на это действие!',
            status: 'error',
          },
        } );
        timer( 1500 )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( _ => {
            this.dialog.closeAll();
          } );
        resolve( false );
      }
    } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }
}
