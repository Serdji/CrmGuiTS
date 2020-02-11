import { Observable, ObservableInput, pipe, UnaryFunction } from 'rxjs';
import { concatAll, toArray } from 'rxjs/operators';

export function concatAllStreamToArray() {
  return pipe(
    concatAll(),
    toArray()
  );
}
