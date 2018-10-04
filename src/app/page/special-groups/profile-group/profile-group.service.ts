import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileGroupService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  getProfileGroup( ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/customerGroup` ).pipe( retry( 10 ) );
  }

  addProfileGroup( params ): Observable<any> {
    return this.http.post( `${this.configService.crmApi}/crm/customerGroup`,  params  ).pipe( retry( 10 ) );
  }

}
