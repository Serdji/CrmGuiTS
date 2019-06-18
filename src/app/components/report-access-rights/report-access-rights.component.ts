import { Component, OnDestroy, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import * as R from 'ramda';
import { map, takeWhile } from 'rxjs/operators';
import { StatisticsReportService } from '../../page/reports/statistics-report/statistics-report.service';


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

  public isProgressTemplates: boolean;
  public isActive: boolean;

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

  constructor( private statisticsReportService: StatisticsReportService ) {}

  ngOnInit(): void {
    this.isActive = true;
    this.isProgressTemplates = true;
    this.treeFlattener = new MatTreeFlattener( this.transformer, this.getLevel,
      this.isExpandable, this.getChildren );
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>( this.getLevel, this.isExpandable );
    this.dataSource = new MatTreeFlatDataSource( this.treeControl, this.treeFlattener );
    this.initTemplates();
  }

  private initTemplates() {
    const TREE_DATA: TodoItemNode[] = [];
    const propItem = R.prop( 'item' );
    const propName = R.prop( 'name' );
    const uniqByName = R.uniqBy( propItem );
    const composeUnnestConfig = R.compose( R.unnest, R.last );
    let reports;
    const startMap = report => {
      reports = report;
      return report;
    };
    const mapNameReport = R.map( propName );

    // Мапируем массив из строк во вложенную структуру
    const funcMapPathConversion = ( template: string ): TodoItemNode[] => {
      // Рекурсивная функция для структурирования вложенностей
      // @ts-ignore
      const funcRecurConfig = ( splitDrop, configTreeData = [], children = [], i = 1 ) => {
        if ( !R.isNil( splitDrop[ 0 ] ) ) {
          const downChildrenReportId = R.find( R.propEq( 'name', splitDrop[ 0 ] ), reports );
          children.push( {
            level: i,
            item: splitDrop[ 0 ],
            children: [],
            // Забераем id из исходного экземпляра объекта
            reportId: !R.isNil( downChildrenReportId ) ? downChildrenReportId.reportId : ''
          } );
          configTreeData.push( children );
        }
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
      TREE_DATA.push( R.unnest( composeTreeDataSplitDrop( template ) ) );
      return TREE_DATA;
    };
    const mapPathConversion = R.map( funcMapPathConversion );

    // Маппинг для уделения повторений и проверки вложанностей структуры каталогов
    const mapRemoveRepetitions = ( templates: any ): TodoItemNode[] => {
      const unnestConfig = composeUnnestConfig( templates );
      const uniqByConfig = uniqByName( unnestConfig );

      // Рекурсия для прохода по не определленной глубене вложанности дерева
      const funcRecurRecDist = ( uniqByCon, unnestCon ) => {
        const mapUniqByConfig = R.map( ( receiver: any ) => {
          const mapUnnestConfig = R.map( ( distributor: any ) => {
            if ( !R.isNil( receiver.children[ 0 ] ) ) {
              if ( receiver.item === distributor.item ) receiver.children.push( distributor.children[ 0 ] );
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
        map( startMap ),
        map( mapNameReport ),
        // @ts-ignore
        map( mapPathConversion ),
        map( mapRemoveRepetitions )
      )
      .subscribe( success );
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
    } else {
      R.forEach( removeReportsIds, nodes );
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
    return flatNode;
  };

  /** Все ли потомки узла выбраны. */
  descendantsAllSelected( node: TodoItemFlatNode ): boolean {
    const descendants = this.treeControl.getDescendants( node );
    const descAllSelected = descendants.every( child => this.checklistSelection.isSelected( child ) );
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

    console.log( this.reportsIds );

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

    console.log( this.reportsIds );

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

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
