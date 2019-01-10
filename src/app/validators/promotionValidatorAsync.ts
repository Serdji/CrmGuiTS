import { AsyncValidatorFn, FormControl, ValidationErrors } from '@angular/forms';
import { AddPromotionsService } from '../page/promotions/add-promotions/add-promotions.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


export const promotionValidatorAsync = ( addPromotionsService: AddPromotionsService ): AsyncValidatorFn => {
  return ( formControl: FormControl ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    if ( formControl.value === '' || formControl.value === null ) return null;
    return addPromotionsService.promotionValidator( formControl.value )
      .pipe(
        map( res => res ? null : { 'promotionValidator': { 'message': 'Такой промоакции нет' } } )
      );
  };
};