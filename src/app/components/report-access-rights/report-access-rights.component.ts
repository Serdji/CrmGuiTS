import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import * as R from 'ramda';
import { map, takeWhile } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { ReportAccessRightsService } from './report-access-rights.service';


/**
 * Узел для дел
 */
export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
  reportId?: number;
}

/** Плоский узел дел с расширяемой и уровневой информацией */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
  reportId?: number;
}


@Component( {
  selector: 'app-report-access-rights',
  templateUrl: './report-access-rights.component.html',
  styleUrls: [ './report-access-rights.component.styl' ],
} )
export class ReportAccessRightsComponent implements OnInit, OnDestroy {

  @Input() loginId: number;
  @Input() isDir: boolean;
  @Output() sendReportsIds = new EventEmitter();
  @Output() sendTemplate = new EventEmitter();

  public isProgressTemplates: boolean;
  public isActive: boolean;
  public isReport: boolean;

  private reportsIds: number[] = [];

  /** Карта от плоского узла к вложенному узлу. Это помогает нам найти вложенный узел, который нужно изменить */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Карта от вложенного узла до плоского узла. Это помогает нам сохранить один и тот же объект для выбора */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** Выбор для контрольного списка */
  checklistSelection = new SelectionModel<TodoItemFlatNode>( true /* multiple */ );

  constructor( private reportAccessRightsService: ReportAccessRightsService ) {}

  ngOnInit(): void {
    this.isActive = true;
    this.isProgressTemplates = true;
    this.isReport = true;
    this.initTemplates();

  }

  private initTemplates() {
    this.isDir = !R.isNil( this.isDir );
    const propReportId = R.prop( 'reportId' );
    const mapMyReports = R.map( propReportId );
    const isNotEmptyArray = template => {
      if ( !R.isEmpty( template ) ) {
        return !R.isEmpty( template );
      } else {
        this.isProgressTemplates = false;
        return !R.isEmpty( template );
      }
    };

    this.reportAccessRightsService.subjectIsReport
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( isReport: boolean ) => this.isReport = isReport );

    const success = value => {
      this.treeFlattener = new MatTreeFlattener( this.transformer, this.getLevel, this.isExpandable, this.getChildren );
      this.treeControl = new FlatTreeControl<TodoItemFlatNode>( this.getLevel, this.isExpandable );
      this.dataSource = new MatTreeFlatDataSource( this.treeControl, this.treeFlattener );
      const getAdminReport = value[ 0 ];
      const getCustomerReport = value[ 1 ];
      this.sendReportsIds.emit( getCustomerReport );
      this.reportsIds = getCustomerReport;
      this.dataSource.data = this.isDir ? value : getAdminReport;
      this.isProgressTemplates = false;
    };

    const oGetAdminReport = this.reportAccessRightsService.getAdminReport()
      .pipe(takeWhile( _ => this.isActive ));
    const oGetCustomerReport = this.reportAccessRightsService.getCustomerReport( this.loginId )
      .pipe(
        takeWhile( _ => this.isActive ),
        map( mapMyReports )
      );
    const getObservablesReports = forkJoin( oGetAdminReport, oGetCustomerReport );
    const getMyReport = _ => this.reportAccessRightsService.getMyReport()
      .pipe(
        takeWhile( _ => this.isActive ),
        takeWhile( isNotEmptyArray ),
      )
      .subscribe( success );
    const collectionReports = _ => getObservablesReports
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( success );

    const whichTemplate = R.ifElse( _ => this.isDir, getMyReport, collectionReports );
    whichTemplate( R.identity );
  }

  private collectReportsIds( nodes: TodoItemFlatNode[], isSelected: boolean ) {
    const composeUniqReportsIds = R.compose( R.uniq, R.unnest );
    const propReportId = R.prop( 'reportId' );
    const mapReportsIds = R.map( propReportId );
    const funcNodes = R.curry( ( node: TodoItemFlatNode, reportsIds: number ) => node.reportId === reportsIds );
    const removeReportsIds = node => {
      const funcReportId = funcNodes( node );
      this.reportsIds = R.reject( funcReportId, this.reportsIds );
    };

    if ( isSelected ) {
      // @ts-ignore
      this.reportsIds.push( mapReportsIds( nodes ) );
      // @ts-ignore
      this.reportsIds = composeUniqReportsIds( this.reportsIds );
      this.sendReportsIds.emit( this.reportsIds );
    } else {
      R.forEach( removeReportsIds, nodes );
      this.sendReportsIds.emit( this.reportsIds );
    }

  }

  getLevel = ( node: TodoItemFlatNode ) => node.level;

  isExpandable = ( node: TodoItemFlatNode ) => node.expandable;

  getChildren = ( node: TodoItemNode ): TodoItemNode[] => node.children;

  hasChild = ( _: number, _nodeData: TodoItemFlatNode ) => _nodeData.expandable;


  /**
   * Трансформатор для преобразования вложенного узла в плоский узел. Запишите узлы в карты для последующего использования.
   */
  transformer = ( node: TodoItemNode, level: number ) => {
    const existingNode = this.nestedNodeMap.get( node );
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.reportId = node.reportId;
    flatNode.level = level;
    flatNode.expandable = !R.isEmpty( node.children );
    this.flatNodeMap.set( flatNode, node );
    this.nestedNodeMap.set( node, flatNode );
    const flatNodeSelect = myReportId => myReportId === flatNode.reportId ? this.checklistSelection.select( flatNode ) : null;
    if ( !R.isNil( this.reportsIds ) ) R.forEach( flatNodeSelect, this.reportsIds );
    return flatNode;
  };

  /** Все ли потомки узла выбраны. */
  descendantsAllSelected( node: TodoItemFlatNode ): boolean {
    const descendants = this.treeControl.getDescendants( node );
    const descAllSelected = descendants.every( child => {
      this.checklistSelection.isSelected( child )
        ? this.checklistSelection.select( node )
        : this.checklistSelection.deselect( node );
      return this.checklistSelection.isSelected( child );
    } );
    return descAllSelected;
  }

  /** Является ли часть потомков выбраны */
  descendantsPartiallySelected( node: TodoItemFlatNode ): boolean {
    const descendants = this.treeControl.getDescendants( node );
    const result = descendants.some( child => this.checklistSelection.isSelected( child ) );
    return result && !this.descendantsAllSelected( node );
  }

  /** Переключить выбор элемента списка дел. Выбрать / отменить выбор всех потомков */
  todoItemSelectionToggle( node: TodoItemFlatNode ): void {
    this.checklistSelection.toggle( node );
    const descendants = this.treeControl.getDescendants( node );
    const isSelected = this.checklistSelection.isSelected( node );
    this.collectReportsIds( descendants, isSelected );

    this.checklistSelection.isSelected( node )
      ? this.checklistSelection.select( ...descendants )
      : this.checklistSelection.deselect( ...descendants );

    // Принудительное обновление для родителя
    descendants.every( child => this.checklistSelection.isSelected( child ) );
    this.checkAllParentsSelection( node );
  }

  /** Переключить лист выбора списка дел. Проверьте всех родителей, чтобы увидеть, если они изменились */
  todoLeafItemSelectionToggle( node: TodoItemFlatNode ): void {
    const isSelected = !this.checklistSelection.isSelected( node );
    this.collectReportsIds( [ node ], isSelected );

    this.checklistSelection.toggle( node );
    this.checkAllParentsSelection( node );
  }

  /** Проверяет всех родителей, когда конечный узел выбран / не выбран */
  checkAllParentsSelection( node: TodoItemFlatNode ): void {
    let parent: TodoItemFlatNode | null = this.getParentNode( node );
    while ( parent ) {
      this.checkRootNodeSelection( parent );
      parent = this.getParentNode( parent );
    }
  }

  /** Проверьте состояние корневого узла и измените его соответствующим образом */
  checkRootNodeSelection( node: TodoItemFlatNode ): void {
    const nodeSelected = this.checklistSelection.isSelected( node );
    const descendants = this.treeControl.getDescendants( node );
    const descAllSelected = descendants.every( child =>
      this.checklistSelection.isSelected( child )
    );
    if ( nodeSelected && !descAllSelected ) {
      this.checklistSelection.deselect( node );
    } else if ( !nodeSelected && descAllSelected ) {
      this.checklistSelection.select( node );
    }
  }

  /** Получить родительский узел узла */
  getParentNode( node: TodoItemFlatNode ): TodoItemFlatNode | null {
    const currentLevel = this.getLevel( node );

    if ( currentLevel < 1 ) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf( node ) - 1;

    for ( let i = startIndex; i >= 0; i-- ) {
      const currentNode = this.treeControl.dataNodes[ i ];

      if ( this.getLevel( currentNode ) < currentLevel ) {
        return currentNode;
      }
    }
    return null;
  }

  onSendTemplate( item: string ): void {
    this.sendTemplate.emit( item );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
