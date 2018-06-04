import { OriginDestination } from './OriginDestination';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { Icity } from '../../interface/icity';


export class ProfileSearchService {

  constructor() { }

  getCity(): Observable<Icity[]> {
    return of( OriginDestination );
  }

}
