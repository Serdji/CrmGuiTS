import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { IcreateUser } from '../../../interface/icreate-user';
import { retry } from 'rxjs/operators';
import { ConfigService } from '../../../services/config-service.service';

@Injectable()
export class AddUserService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  createUser( params: IcreateUser ): Observable<any> {
    return this.http.post( environment.crmApi + '/admin/user', params ).pipe( retry( 10 ) );
  }

}
