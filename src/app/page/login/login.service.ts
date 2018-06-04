import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoginService {

  constructor(private http: HttpClient) { }

  getVersion(): Observable<string> {
    return this.http.get('assets/version.txt', { responseType: 'text' });
  }
}
