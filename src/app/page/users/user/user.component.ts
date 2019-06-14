import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IlistUsers } from '../../../interface/ilist-users';
import { UserService } from './user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatTreeNestedDataSource } from '@angular/material';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { timer } from 'rxjs/observable/timer';
import { map, takeWhile } from 'rxjs/operators';
import { ActivityUserService } from '../../../services/activity-user.service';
import { person } from './person';
import * as R from 'ramda';
import { IFoodNode } from '../../../interface/ifood-node';
import { NestedTreeControl } from '@angular/cdk/tree';
import { StatisticsReportService } from '../../reports/statistics-report/statistics-report.service';

@Component( {
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: [ './user.component.styl' ]
} )
export class UserComponent implements OnInit, OnDestroy {

  public treeControl = new NestedTreeControl<IFoodNode>( node => node.children );
  public dataSource = new MatTreeNestedDataSource<IFoodNode>();

  public user: IlistUsers;
  public progress: boolean;
  public updateUser: FormGroup;
  public updatePassword: FormGroup;
  public formPermission: FormGroup;
  public edit = false;
  public persons: { title: string, ids: number[] }[] = person;
  public isProgressTemplates: boolean;

  private checkboxArr: number[];
  private loginId: number;
  private isActive: boolean;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private activityUserService: ActivityUserService,
    private statisticsReportService: StatisticsReportService
  ) { }

  ngOnInit() {
    this.isActive = true;
    this.isProgressTemplates = true;

    this.initUser();
    this.initFormUser();
    this.initFormPassword();
    this.initFormPermission();
    this.initTemplates();
  }

  private initTemplates() {
    const TREE_DATA: IFoodNode[] = [];
    const propName = R.prop( 'name' );
    const uniqByName = R.uniqBy( propName );
    const composeUnnestConfig = R.compose( R.unnest, R.last );

    // Мапируем массив из строк во вложенную структуру
    const funcMapPathConversion = ( template: string ): IFoodNode[] => {
      // Рекурсивная функция для структурирования вложенностей
      // @ts-ignore
      const funcRecurConfig = ( splitDrop, configTreeData = [], children = [], i = 1 ) => {
        if ( !R.isNil( splitDrop[ 0 ] ) )
          children.push( {
            level: i,
            name: splitDrop[ 0 ],
            children: []
          } );
        configTreeData.push( children );
        if ( !R.isEmpty( splitDrop ) ) funcRecurConfig( R.tail( splitDrop ), configTreeData, children[ 0 ].children, ++i );
        return configTreeData;
      };
      const composeTreeDataSplitDrop = R.compose(
        R.filter( R.propEq( 'level', 1 ) ),
        R.unnest,
        funcRecurConfig,
        R.append( template ),
        R.dropLast( 1 ),
        // @ts-ignore
        R.split( '/' )
      );
      // @ts-ignore
      TREE_DATA.push( composeTreeDataSplitDrop( template ) );
      return R.unnest( TREE_DATA );
    };
    const mapPathConversion = R.map( funcMapPathConversion );

    // Маппинг для уделения повторений и проверки вложанностей структуры каталогов
    const mapRemoveRepetitions = ( templates: any ): IFoodNode[] => {
      const unnestConfig = composeUnnestConfig( templates );
      const uniqByConfig = uniqByName( unnestConfig );

      // Рекурсия для прохода по не определленной глубене вложанности дерева
      const funcRecurRecDist = ( uniqByCon, unnestCon ) => {
        const mapUniqByConfig = R.map( ( receiver: any ) => {
          const mapUnnestConfig = R.map( ( distributor: any ) => {
            if ( !R.isNil( receiver.children[ 0 ] ) ) {
              if ( receiver.name === distributor.name ) receiver.children.push( distributor.children[ 0 ] );
              if ( !R.isEmpty( receiver.children ) ) funcRecurRecDist( receiver.children, receiver.children );
            }
          } );
          mapUnnestConfig( unnestCon );
          if ( !R.isEmpty( receiver.children ) ) {
            receiver.children = uniqByName( receiver.children );
            return receiver;
          }
        } );
        return mapUniqByConfig( uniqByCon );
      };
      return funcRecurRecDist( uniqByConfig, unnestConfig );
    };

    const success = templates => {
      this.dataSource.data = templates;
      this.isProgressTemplates = false;
    };

    this.statisticsReportService.getAdminReport()
      .pipe(
        takeWhile( _ => this.isActive ),
        map( mapPathConversion ),
        map( mapRemoveRepetitions )
      )
      .subscribe( success );
  }

  private initUser() {
    this.progress = true;
    this.route.params
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( params ) => {
        this.loginId = params.id;
        this.userService.getUser( params.id ).subscribe( ( user: IlistUsers ) => {
          this.user = user;
          this.updateUser.patchValue( user );
          if ( user.claimPermissions ) {
            for ( const claimPermission of user.claimPermissions ) {
              this.formPermission.patchValue( { [ claimPermission.id ]: true } );
            }
          }
          this.checkboxDisabled();
          this.progress = false;
        } );
      } );
  }

  private initFormUser() {
    this.updateUser = this.fb.group( {
      login: [ '', [ Validators.required, Validators.minLength( 3 ) ] ],
      email: [ '', [ Validators.email ] ],
      loginName: [ '', [ Validators.required, Validators.minLength( 3 ) ] ],
    } );
  }

  private initFormPassword() {
    this.updatePassword = this.fb.group( {
      newPassword: [ '', [ Validators.required, Validators.minLength( 6 ) ] ],
      confirmPassword: [ '', [ Validators.required, Validators.minLength( 6 ) ] ],
    } );

  }
  private initFormPermission() {
    const formGroup = {};
    const propIds = R.prop( 'ids' );
    const mapIds = R.map( propIds );
    const funcControlConfig = id => formGroup[ id ] = '';
    const mapControlConfig = R.map( funcControlConfig );
    const funcCheckboxArr = arrIds => this.checkboxArr = arrIds;
    const tapCheckboxArr = R.tap( funcCheckboxArr );
    const composeIds = R.compose( mapControlConfig, tapCheckboxArr, R.flatten, mapIds );
    composeIds( this.persons );
    this.formPermission = this.fb.group( formGroup );
  }

  private checkboxDisabled() {
    R.map( id => {
      if ( id % 2 === 0 ) {
        this.formPermission.get( `${id}` )[ this.formPermission.get( `${id - 1}` ).value ? 'enable' : 'disable' ]();
        this.formPermission.get( `${id - 1}` ).valueChanges
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( value => {
            this.formPermission.get( `${id}` )[ value ? 'enable' : 'disable' ]();
            this.formPermission.get( `${id}` ).patchValue( '' );
          } );
      }
    }, this.checkboxArr );
  }

  private windowDialog( messDialog: string, params: string, card: string = '', disableTimer: boolean = false ) {
    this.dialog.open( DialogComponent, {
      data: {
        message: messDialog,
        status: params,
        params: this.loginId,
        card,
      },
    } );
    if ( !disableTimer ) {
      timer( 1500 )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( _ => {
          this.dialog.closeAll();
          this.edit = false;
        } );
    }
  }

  sendFormUser(): void {
    if ( !this.updateUser.invalid ) {
      const params = this.updateUser.getRawValue();
      Object.assign( params, { loginId: this.loginId } );
      this.userService.putUser( params )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( ( user: IlistUsers ) => {
          this.user = user;
          this.windowDialog( 'Пользователь успешно изменен', 'ok' );
        } );
    }
  }

  deleteUser(): void {
    this.windowDialog( `Вы действительно хотите удалить пользователя "${this.user.login}" ?`, 'delete', 'user', true );
  }

  sendFormPassword(): void {
    if ( !this.updatePassword.invalid ) {
      const params = this.updatePassword.getRawValue();
      Object.assign( params, { loginId: this.loginId } );
      this.userService.putPassword( params )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( _ => this.windowDialog( 'Пароль успешно изменен', 'ok' ) );
    }
  }

  sendFormPermission(): void {
    const progressArray = [];
    for ( const key of Object.keys( this.formPermission.getRawValue() ) ) {
      if ( this.formPermission.get( key ).value ) progressArray.push( +key );
    }
    const params = Object.assign( {}, { loginId: +this.loginId, ClaimPermissions: progressArray } );
    this.userService.updateClaimPermissions( params )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        if ( this.user.login === localStorage.getItem( 'login' ) ) {
          this.windowDialog( 'Вы изменили права для своей учетной записи. Чтобы права вступили в силу Вам нужно зайти в приложение заново. Через несколько секунд Вы будете перенаправлены на страницу авторизации!', 'error', '', true );
          timer( 5000 )
            .pipe( takeWhile( _ => this.isActive ) )
            .subscribe( _ => {
              this.dialog.closeAll();
              this.activityUserService.logout();
              this.edit = false;
            } );
        } else {
          this.windowDialog( 'Права пользователя изменены', 'ok' );
        }
      } );
  }

  toggleEdit(): void {
    this.edit = !this.edit;
  }

  hasChild = ( _: number, node: IFoodNode ) => !!node.children && node.children.length > 0;

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
