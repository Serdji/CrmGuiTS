import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, retry } from 'rxjs/operators';
import { ConfigService } from '../../../services/config-service.service';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable( {
  providedIn: 'root'
} )
export class UserService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private router: Router,
  ) { }

  getUser( id ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/admin/user/${id}` )
      .pipe(
        this.retryRequestService.retry(),
        catchError( ( err: any ) => {
          switch ( err.status ) {
            case 404:
              this.router.navigate( [ 'crm/404' ] );
              break;
          }
          return throwError( err );
        } )
      );
  }

  putUser( params ): Observable<any> {
    return this.http.put( `${this.configService.crmApi}/admin/user`, params ).pipe( this.retryRequestService.retry() );
  }

  deleteUser( id ): Observable<any> {
    return this.http.delete( `${this.configService.crmApi}/admin/user/${id}` ).pipe( this.retryRequestService.retry() );
  }

  putPassword( params ): Observable<any> {
    return this.http.put( `${this.configService.crmApi}/admin/user/update-password`, params ).pipe( this.retryRequestService.retry() );
  }

  updateClaimPermissions( params ): Observable<any> {
    return this.http.post( `${this.configService.crmApi}/admin/user/update-claim-permissions`, params ).pipe( this.retryRequestService.retry() );
  }


}
