import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IlistUsers } from '../../interface/ilist-users';

@Injectable()
export class ListUsersService {

  constructor( private http: HttpClient ) { }

  getListUsers (): Observable<any> {
    return this.http.get( `${environment.crmApi}/admin/login` );
  }

}
