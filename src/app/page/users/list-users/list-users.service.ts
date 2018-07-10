import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class ListUsersService {

  constructor( private http: HttpClient ) { }

  getListUsers(): Observable<any> {
    const httpListUsers = this.http.get( `${environment.crmApi}/admin/user` );
    return httpListUsers
      .pipe(
        catchError( ( err: HttpErrorResponse ) => {
          if (err.status === 401) {
            console.log(1);
            return httpListUsers;
          }
        }));
  }

}
