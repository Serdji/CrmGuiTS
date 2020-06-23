import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IndexService } from './index.service';
import { IindexConfig } from '../../../interface/iindex-config';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { timer } from 'rxjs/observable/timer';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { tap } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component( {
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: [ './index.component.styl' ]
} )
export class IndexComponent implements OnInit, OnDestroy {

  public isDisabledButton: boolean;
  public formIndex: FormGroup;

  constructor(
    private fb: FormBuilder,
    private indexService: IndexService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.isDisabledButton = false;
    this.initFormIndex();
    this.initGetIndexConfig();
  }

  private windowDialog( messDialog: string, params: string ) {
    this.dialog.open( DialogComponent, {
      data: {
        message: messDialog,
        status: params,
      },
    } );
    timer( 1500 )
      .pipe( untilDestroyed( this ) )
      .subscribe( _ => {
        this.dialog.closeAll();
      } );
  }

  initFormIndex() {
    this.formIndex = this.fb.group( {
      saleDateFrom: '',
      saleDateTo: '',
      pastActiveFrom: '',
      pastActiveTo: '',
      actualActiveFrom: '',
      actualActiveTo: ''
    } );
  }

  private initGetIndexConfig() {
    this.indexService.getIndexConfig().subscribe( ( config: IindexConfig ) => {
      this.formIndex.patchValue( config );
    } );
  }

  public onEditIndexConfig(): void {
    this.isDisabledButton = true;
    const newConfig: IindexConfig = {} as IindexConfig;
    _.each( this.formIndex.value, ( val, key ) => newConfig[ key ] = moment( val ).format( 'YYYY-MM-DD' ) + 'T00:00:00' );
    this.indexService.putIndexConfig( newConfig )
      .pipe( tap( _ => this.isDisabledButton = false ) )
      .subscribe(
        ( config: IindexConfig ) => {
          this.formIndex.patchValue( config );
          this.windowDialog( 'DIALOG.OK.INDEX_SETTING', 'ok' );
        },
        _ => this.isDisabledButton = false
      );
  }

  ngOnDestroy(): void {}

}
