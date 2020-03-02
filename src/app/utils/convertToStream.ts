import { Observable } from 'rxjs';
import { concatAll, toArray } from 'rxjs/operators';

export const convertToStream = ( ...operators: Function[] ) => pipeFromArray( concatAll(), ...operators, toArray() );
const pipeFromArray = ( ...operators: Function[] ) => ( source: Observable<any> ) => operators.reduce( ( acc, fn ) => fn( acc ), source );
