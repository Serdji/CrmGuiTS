import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';

@Component( {
  selector: 'app-age-interval',
  templateUrl: './age-interval.component.html',
  styleUrls: [ './age-interval.component.styl' ]
} )
export class AgeIntervalComponent implements OnInit {


  public formAddAgeInterval: FormGroup;
  public formCreateAgeInterval: FormGroup;
  public parameters = [
    {
      id: 1,
      ageTo: 12,
      ageFrom: 15,
      title: 'Подростки'
    },
    {
      id: 2,
      ageTo: 16,
      ageFrom: 18,
      title: 'Совершеннолетнии'
    },
    {
      id: 3,
      ageTo: 18,
      ageFrom: 21,
      title: 'Продажа табака и алкоголя'
    },
  ];


  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.initForms();
  }

  private initForms(): void {
    _.each( [ 'formAddAgeInterval', 'formCreateAgeInterval' ], formName => {
      this[ formName ] = this.fb.group( {
        ageTo: '',
        ageFrom: '',
        title: ''
      } );
    } );
  }

  public onAdd(): void {
    const formValue = this.formAddAgeInterval.value;
    this.parameters.push( {
      id: _.random(100),
      ...formValue
    } );
    console.log( this.parameters );
  }

  public onCreate( id: number ): void {
    console.log( id );

  }

  public onClose( id: number ): void {
    this.parameters = _.reject( this.parameters, { id } );
  }


}
