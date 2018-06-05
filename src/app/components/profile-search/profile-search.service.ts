import { originDestinationObj } from './origin-destination';
import { Observable, of } from 'rxjs';
import { Icity } from '../../interface/icity';
import { Injectable } from '@angular/core';
import { HttpQueryService } from '../../services/http-query.service';
import { Itree } from '../../interface/itree';

@Injectable()
export class ProfileSearchService {

  constructor( private http: HttpQueryService ) { }

  getCity(): Observable<Icity[]> {
    return of( originDestinationObj );
  }

  getTree(): Observable<Itree[]> {
    return this.http.get('api/api/Segmentation/tree');
  }
  getGroups(): Observable<Itree[]> {
    return this.http.get('api/api/CustomerGroup/groups');
  }

}
