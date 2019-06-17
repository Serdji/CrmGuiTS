import { Component, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';


/**
 * Узел для дел
 */
export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
}

/** Плоский узел дел с расширяемой и уровневой информацией */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
}

/**
 * Объект Json для данных списка дел.
 */
const TREE_DATA = {
  Groceries: {
    'Almond Meal flour': null,
    'Organic eggs': null,
    'Protein Powder': null,
    Fruits: {
      Apple: null,
      Berries: [ 'Blueberry', 'Raspberry' ],
      Orange: null
    }
  },
  Reminders: [
    'Cook dinner',
    'Read the Material Design spec',
    'Upgrade Application to Angular'
  ]
};

/**
 * Контрольный список базы данных, он может построить древовидную структуру Json объекта.
 * Каждый узел в объекте Json представляет элемент списка дел или категорию.
 * Если узел является категорией, он имеет дочерние элементы, и в категорию можно добавлять новые элементы.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>( [] );

  get data(): TodoItemNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Создаем узлы дерева из объекта Json. Результатом является список `TodoItemNode` с вложенным
    // файловый узел как дочерний
    const data = this.buildFileTree( TREE_DATA, 0 );

    // Уведомить об изменении.
    this.dataChange.next( data );
  }

  /**
   * Построить дерево структуры файла. `value` - это объект Json или поддерево объекта Json.
   * Возвращаемое значение - список `TodoItemNode`.
   */
  buildFileTree( obj: { [ key: string ]: any }, level: number ): TodoItemNode[] {
    return Object.keys( obj ).reduce<TodoItemNode[]>( ( accumulator, key ) => {
      const value = obj[ key ];
      const node = new TodoItemNode();
      node.item = key;

      if ( value != null ) {
        if ( typeof value === 'object' ) {
          node.children = this.buildFileTree( value, level + 1 );
        } else {
          node.item = value;
        }
      }

      return accumulator.concat( node );
    }, [] );
  }

  /** Добавить элемент в список дел */
  insertItem( parent: TodoItemNode, name: string ) {
    if ( parent.children ) {
      parent.children.push( { item: name } as TodoItemNode );
      this.dataChange.next( this.data );
    }
  }

  updateItem( node: TodoItemNode, name: string ) {
    node.item = name;
    this.dataChange.next( this.data );
  }
}


@Component( {
  selector: 'app-report-access-rights',
  templateUrl: './report-access-rights.component.html',
  styleUrls: [ './report-access-rights.component.styl' ],
  providers: [ ChecklistDatabase ]
} )
export class ReportAccessRightsComponent {
  /** Карта от плоского узла к вложенному узлу. Это помогает нам найти вложенный узел, который нужно изменить */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** Карта от вложенного узла до плоского узла. Это помогает нам сохранить один и тот же объект для выбора */
  selectedParent: TodoItemFlatNode | null = null;

  /** Название нового предмета */
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** Выбор для контрольного списка */
  checklistSelection = new SelectionModel<TodoItemFlatNode>( true /* multiple */ );

  constructor( private _database: ChecklistDatabase ) {
    this.treeFlattener = new MatTreeFlattener( this.transformer, this.getLevel,
      this.isExpandable, this.getChildren );
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>( this.getLevel, this.isExpandable );
    this.dataSource = new MatTreeFlatDataSource( this.treeControl, this.treeFlattener );

    _database.dataChange.subscribe( data => {
      this.dataSource.data = data;
    } );
  }

  getLevel = ( node: TodoItemFlatNode ) => node.level;

  isExpandable = ( node: TodoItemFlatNode ) => node.expandable;

  getChildren = ( node: TodoItemNode ): TodoItemNode[] => node.children;

  hasChild = ( _: number, _nodeData: TodoItemFlatNode ) => _nodeData.expandable;

  hasNoContent = ( _: number, _nodeData: TodoItemFlatNode ) => _nodeData.item === '';

  /**
   * Трансформатор для преобразования вложенного узла в плоский узел. Запишите узлы в карты для последующего использования.
   */
  transformer = ( node: TodoItemNode, level: number ) => {
    const existingNode = this.nestedNodeMap.get( node );
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set( flatNode, node );
    this.nestedNodeMap.set( node, flatNode );
    return flatNode;
  };

  /** Все ли потомки узла выбраны. */
  descendantsAllSelected( node: TodoItemFlatNode ): boolean {
    const descendants = this.treeControl.getDescendants( node );
    const descAllSelected = descendants.every( child =>
      this.checklistSelection.isSelected( child )
    );
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
    this.checklistSelection.isSelected( node )
      ? this.checklistSelection.select( ...descendants )
      : this.checklistSelection.deselect( ...descendants );

    // Принудительное обновление для родителя
    descendants.every( child =>
      this.checklistSelection.isSelected( child )
    );
    this.checkAllParentsSelection( node );
  }

  /** Переключить лист выбора списка дел. Проверьте всех родителей, чтобы увидеть, если они изменились */
  todoLeafItemSelectionToggle( node: TodoItemFlatNode ): void {
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

  /** Выберите категорию, чтобы мы могли вставить новый элемент. */
  addNewItem( node: TodoItemFlatNode ) {
    const parentNode = this.flatNodeMap.get( node );
    this._database.insertItem( parentNode!, '' );
    this.treeControl.expand( node );
  }

  /** Сохранить узел в базе данных */
  saveNode( node: TodoItemFlatNode, itemValue: string ) {
    const nestedNode = this.flatNodeMap.get( node );
    this._database.updateItem( nestedNode!, itemValue );
  }

}
