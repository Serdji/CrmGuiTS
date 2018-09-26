import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoginService {

  constructor(private http: HttpClient) { }

  getUrlApi(): Observable<string> {
    return this.http.get('assets/urlApi.txt', { responseType: 'text' });

  } getVersion(): Observable<string> {
    return this.http.get('assets/version.txt', { responseType: 'text' });
  }
}
