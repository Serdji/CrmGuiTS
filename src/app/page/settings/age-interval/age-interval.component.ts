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

  private hideFormCreate() {
    const formCreateNodeList: NodeList = document.querySelectorAll( '.age-interval__form-create' );
    const itemNodeList: NodeList = document.querySelectorAll( '.age-interval__row-item' );
    _.each( formCreateNodeList, ( formNode: HTMLElement ) => formNode.classList.add( '_hidden' ) );
    _.each( itemNodeList, ( itemNode: HTMLElement ) => itemNode.classList.remove( '_hidden' ) );
  }

  public onAddCreate( id: number ) {
    this.parameters = _.map( this.parameters, params => {
      if ( params.id === id ) {
        _.each( params, ( val, key ) => params[key] = this.formCreateAgeInterval.value[key] );
        params.id = id;
      }
      return params;
    } );
    this.hideFormCreate();
  }

  public onCreate(item: HTMLElement, formCreate: HTMLElement,  id: number ): void {
    this.hideFormCreate();
    item.classList.toggle( '_hidden' );
    formCreate.classList.toggle( '_hidden' );
    this.formCreateAgeInterval.patchValue( _.find( this.parameters, { id } ) );
  }

  public onClose( id: number ): void {
    this.parameters = _.reject( this.parameters, { id } );
  }

  public onAdd(): void {
    const formValue = this.formAddAgeInterval.value;
    this.parameters.push( {
      id: _.random(1000),
      ...formValue
    } );
  }


}
