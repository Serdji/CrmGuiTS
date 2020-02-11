import { Observable } from 'rxjs';
import { concatAll, toArray } from 'rxjs/operators';

export const concatAllStreamToArray = ( ...fns: Function[] ) => pipeFromArray( concatAll(), ...fns, toArray() );
const pipeFromArray = ( ...fns: Function[] ) => ( source: Observable<any> ) => fns.reduce( ( acc, fn ) => fn( acc ), source );
