import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { fromEvent, Observable, of, pipe } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { IAgeGroups } from '../../../interface/iage-group';
import { AgeIntervalService } from './age-interval.service';
import { ConvertToStream } from '../../../utils/ConvertToStream';

@Component( {
  selector: 'app-age-interval',
  templateUrl: './age-interval.component.html',
  styleUrls: [ './age-interval.component.styl' ]
} )
export class AgeIntervalComponent implements OnInit {


  public formAddAgeInterval: FormGroup;
  public formCreateAgeInterval: FormGroup;
  public ageGroups: IAgeGroups[];


  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private convertToStream: ConvertToStream,
    private ageIntervalService: AgeIntervalService
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.initEvent();
    this.initAgeInterval();
  }

  public initAgeInterval() {
    this.ageIntervalService.getAgeGroups()
      .pipe(
        pluck( 'ageGroups' ),
        this.convertToStream.stream(
          map( ( ageGroups: IAgeGroups ) =>  _.set( ageGroups, 'gender', _.toLower( ageGroups.gender ) ) )
        )
      ).subscribe( ( ageGroups: IAgeGroups[] ) => this.ageGroups = ageGroups );
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
    this.ageGroups = _.map( this.ageGroups, params => {
      if ( params.id === id ) {
        _.each( params, ( val, key ) => params[ key ] = this.formCreateAgeInterval.value[ key ] );
        params.id = id;
      }
      return params;
    } );
    this.ageIntervalService.updateAgeGroups( this.ageGroups ).subscribe();
    this.hideFormCreate();
  }

  public onCreate( item: HTMLElement, formCreate: HTMLElement, id: number ): void {
    this.hideFormCreate();
    item.classList.toggle( '_hidden' );
    formCreate.classList.toggle( '_hidden' );
    this.formCreateAgeInterval.patchValue( _.find( this.ageGroups, { id } ) );
  }

  public onDelete( id: number ): void {
    this.ageGroups = _.reject( this.ageGroups, { id } );
    this.ageIntervalService.updateAgeGroups( this.ageGroups ).subscribe();
  }

  public onAdd(): void {
    const formValue = this.formAddAgeInterval.value;
    this.ageGroups.push( {
      id: _.random( 1000 ),
      ...formValue
    } );
    this.ageIntervalService.updateAgeGroups( this.ageGroups ).subscribe();
  }


}
