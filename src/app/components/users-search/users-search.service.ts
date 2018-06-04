import { Injectable } from '@angular/core';
import { HttpQueryService } from '../../services/http-query.service';
import { Observable } from 'rxjs/Observable';
import { IuserSearch } from '../../interface/iuser-search';

@Injectable()
export class UsersSearchService {

  constructor(private httpQuery: HttpQueryService) { }

  getUserSearch (params: string): Observable<IuserSearch> {
    return this.httpQuery.getWithOptions('web_auth/api/accounts/users', params);
  }

}
