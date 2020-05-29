import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { fromEvent, Observable, pipe } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { IAgeGroup, IAgeGroups } from '../../../interface/iage-group';
import { AgeIntervalService } from './age-interval.service';

@Component( {
  selector: 'app-age-interval',
  templateUrl: './age-interval.component.html',
  styleUrls: [ './age-interval.component.styl' ]
} )
export class AgeIntervalComponent implements OnInit {


  public formAddAgeInterval: FormGroup;
  public formCreateAgeInterval: FormGroup;
  public ageGroups$: Observable<IAgeGroups[]>;


  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private ageIntervalService: AgeIntervalService
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.initEvent();
    this.initAgeInterval();
  }

  public initAgeInterval() {
    this.ageGroups$ = this.ageIntervalService.getAgeGroups()
      .pipe(
        pluck( 'ageGroups' )
      ) as Observable<IAgeGroups[]>;
  }

  private initEvent(): void {
    fromEvent( document, 'click' )
      .pipe(
        map( ( e: Event ) => _.map( e.composedPath(), ( node: HTMLElement ) => node.className ) ),
        map( ( classNames: string[] ) => ( _.includes( classNames, 'age-interval' ) ) || _.includes( classNames, 'cdk-overlay-pane' ) )
      )
      .subscribe( ( isTarget: boolean ) => {
        if ( !isTarget ) this.hideFormCreate();
      } );
  }

  private initForms(): void {
    _.each( [ 'formAddAgeInterval', 'formCreateAgeInterval' ], formName => {
      this[ formName ] = this.fb.group( {
        ageTo: '',
        ageFrom: '',
        gender: '',
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
        _.each( params, ( val, key ) => params[ key ] = this.formCreateAgeInterval.value[ key ] );
        params.id = id;
      }
      return params;
    } );
    this.hideFormCreate();
  }

  public onCreate( item: HTMLElement, formCreate: HTMLElement, id: number ): void {
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
      id: _.random( 1000 ),
      ...formValue
    } );
  }


}
