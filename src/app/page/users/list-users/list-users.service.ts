import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';
import { ConfigService } from '../../../services/config-service.service';

@Injectable()
export class ListUsersService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  getListUsers(): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/admin/user` ).pipe( retry( 5 ) );
  }

}
