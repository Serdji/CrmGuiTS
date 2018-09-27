import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';
import { IclaimPermission } from '../../../interface/iclaim-permission';
import { retry } from 'rxjs/operators';
import { ConfigService } from '../../../services/config-service.service';

@Injectable( {
  providedIn: 'root'
} )
export class UserService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  getUser( id ): Observable<any> {
    return this.http.get( `${environment.crmApi}/admin/user/${id}` ).pipe( retry( 10 ) );
  }

  putUser( params ): Observable<any> {
    return this.http.put( `${environment.crmApi}/admin/user`, params ).pipe( retry( 10 ) );
  }

  deleteUser( id ): Observable<any> {
    return this.http.delete( `${environment.crmApi}/admin/user/${id}` ).pipe( retry( 10 ) );
  }

  putPassword( params ): Observable<any> {
    return this.http.put( `${environment.crmApi}/admin/user/update-password`, params ).pipe( retry( 10 ) );
  }

  updateClaimPermissions( params ): Observable<any> {
    return this.http.post( `${environment.crmApi}/admin/user/update-claim-permissions`, params ).pipe( retry( 10 ) );
  }


}
