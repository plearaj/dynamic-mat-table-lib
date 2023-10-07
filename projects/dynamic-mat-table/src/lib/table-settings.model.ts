import {SelectionModel} from "@angular/cdk/collections";
import {ActionSettings, Button, PaginatorSettings, TableColumn} from "./dynamic-mat-table.model";
import {warn} from "ng-packagr/lib/utils/log";
import {FormControl, FormGroup, Validators} from "@angular/forms";

export class TableSettings {
  private tableColumns: TableColumn[];
  private readonly columnDef: string[] = [];
  private readonly filters: string[] = [];
  private readonly newDataItem: any;
  private readonly allowMassUpdate: boolean;
  private readonly filterFormGroup = new FormGroup<any>({});
  constructor(
    columns: TableColumn[], private showFilter: boolean, private filterType: 'simple' | 'column' = 'simple',
    private showPagination: boolean, private showSelection: boolean, private actionColumn: boolean, private tableName: string,
    private filterOnDataChange: boolean, private keepFilters: boolean, private allowAddData: boolean, private throwAddEvent: boolean,
    private throwDeleteEvent: boolean, private allowDragAndDrop: boolean, private allowSave: boolean,
    private noRecordMessage: string,
    private addButton: Button = {
      buttonText: 'Add',
      buttonColor: "default",
      iconType: 'none',
    },
    private  deleteButton: Button = {
      buttonText: 'Delete',
      buttonColor: "default",
      iconType: 'none',
    },
    private saveButton: Button = {
      buttonText: 'Save',
      buttonColor: "default",
      iconType: 'none',
    },
    private newDataItemFn?: () => any,
    private saveDataFn?: () => any | void,
    private paginatorSettings?: PaginatorSettings,
    private selectionModel?: SelectionModel<any>, private actionSettings?: ActionSettings
  ) {
    this.tableColumns = this.createTableColumns(columns, filterType);
    this.showFilter = showFilter;
    this.filterType = filterType;
    this.showPagination = showPagination;
    this.showSelection = showSelection;
    if (showSelection && !selectionModel) {
      throw new Error('selectionModel must be defined when showSelection is set to true');
    }
    this.selectionModel = selectionModel;
    this.actionColumn = actionColumn;
    if (actionColumn && !actionSettings) {
      throw new Error('actionSettings must be defined when actionColumn is set to true.');
    }
    this.tableName = tableName;
    this.filterOnDataChange = filterOnDataChange;
    this.keepFilters = keepFilters;
    this.allowAddData = allowAddData;
    if (allowAddData && !newDataItemFn) {
      throw new Error('newDataItemFn must be defined when allowAddData is set to true.')
    } else if (allowAddData && newDataItemFn) {
      this.newDataItem = newDataItemFn();
    }
    this.throwAddEvent = throwAddEvent;
    this.addButton = addButton;
    this.deleteButton = deleteButton;
    this.throwDeleteEvent = throwDeleteEvent;
    this.allowDragAndDrop = allowDragAndDrop;
    this.allowMassUpdate = columns.some(column => column.allowMassUpdate);
    this.allowSave = allowSave;
    if (allowAddData && !throwAddEvent && !allowSave) {
      warn('allowAddData is to true but allowSave and throwAddEvent is set to false. Data will not be saved')
    }
    this.saveDataFn = saveDataFn;
  }

  createFormControl(defaultValue: any, required: boolean) {
    if (required) {
      return new FormControl(defaultValue, Validators.required)
    }
    return new FormControl(defaultValue)
  }

  private createTableColumns(columns: TableColumn[], filterType: 'column' | 'simple') {
    return columns.map(column => {
      let tableColumn = column;
      this.columnDef.push(column.columnDataName);
      if (filterType === 'column') {
        tableColumn.filterName = column.columnDataName + 'Filter';
        this.filters.push(tableColumn.filterName);
        if (column.filterable) {
          let filterFormControl: FormGroup | FormControl;
          if (column.columnDataType === 'dateRange') {
            filterFormControl = new FormGroup({
              start: new FormControl<Date | null>(null),
              end: new FormControl<Date | null>(null)
            });
          } else {
            filterFormControl = this.createFormControl(null, false);
          }
          this.filterFormGroup.addControl(tableColumn.filterName as string, filterFormControl);
        }
      }
      return tableColumn;
    });
  }
}
