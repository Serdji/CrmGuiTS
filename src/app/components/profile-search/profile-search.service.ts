import { originDestinationObj } from './origin-destination';
import { Observable, of } from 'rxjs';
import { Icity } from '../../interface/icity';


export class ProfileSearchService {

  constructor() { }

  getCity(): Observable<Icity[]> {
    return of( originDestinationObj );
  }

}
