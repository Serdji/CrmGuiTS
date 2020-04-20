import { Observable } from 'rxjs';
import { concatAll, toArray } from 'rxjs/operators';

export class ConvertToStream {
  public stream = ( ...operators: Function[] ) => this.pipeFromArray( concatAll(), ...operators, toArray() );
  private pipeFromArray = ( ...operators: Function[] ) => ( source: Observable<any> ) => operators.reduce( ( acc, fn ) => fn( acc ), source ); 1

}
