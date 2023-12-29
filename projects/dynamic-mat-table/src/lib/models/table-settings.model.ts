import {SelectionModel} from "@angular/cdk/collections";
import {ITableColumn} from "./dynamic-mat-table.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {signal, WritableSignal} from "@angular/core";
import {DynamicMatTableColumn} from "./dynamict-mat-table-column.model";
import {DynamicMatTablePaginator, PaginatorSettings} from "./paginator-settings.model";
import {DynamicMatTableFilter} from "./dynamic-mat-table-filter.model";
import {DynamicMatTableSelection} from "./dynamic-mat-table-selection.model";
import {
  DynamicMatTableActionOptions,
  DynamicMatTableActionSettings
} from "./dynamic-mat-table-action-settings.model";
import {DynamicMatTableDataInteractionSettings} from "./dynamic-mat-table-data-interaction-settings/dynamic-mat-table-data-interaction-settings.model";
import {
  NewDataItem,
  NewDataItemFnAnon, NewDataItemFnElement, NewDataItemFnParams
} from "./dynamic-mat-table-data-interaction-settings/dynamic-mat-table-add-settings/new-data-item.model";
import {
  SaveDataFnElement,
  SaveDataFnElements
} from "./dynamic-mat-table-data-interaction-settings/dynamic-mat-table-save-settings/save-data-fn.model";
import {DynamicMatTableButton, DynamicMatTableLabeledButton} from "./dynamic-mat-table-button.model";

export class TableSettings {
  readonly tableColumns: DynamicMatTableColumn[];
  readonly columnDef: string[] = [];
  readonly filters: string[] = [];
  private readonly allowMassUpdate: boolean;
  readonly filterFormGroup = new FormGroup<any>({});
  readonly paginatorSettings?: PaginatorSettings;
  readonly formFieldColumns: DynamicMatTableColumn[] = [];
  readonly showFilter: boolean;
  readonly filterType: 'simple' | 'column';
  readonly filterOnDataChange: boolean = false;
  readonly keepFilters: boolean = false;
  readonly showPagination: boolean;
  // readonly pageSize = signal<number>(10);
  // readonly pageSizeOptions = signal<number[]>([5, 10, 25]);
  // readonly hidePageSize= signal<boolean>(false);
  // readonly showFirstLastButtons = signal<boolean>(false);
  // readonly allowMaxLength: boolean = false;
  //Selection Settings Variables:
  readonly showSelection = signal<boolean>(false);
  private selectionModel?: SelectionModel<any>;
  //Action Settings Variables:
  readonly showActionColumn= signal<boolean>(false);
  actionOptions?: DynamicMatTableActionOptions;
  //Data Interaction Settings - Add Variables:
  readonly allowAddData = signal<boolean>(false);
  readonly notifyOfAddBy: 'subscription' | 'event';
  readonly addDataMethod: 'routing' | 'dialog' | 'na' | 'table' | 'function';
  readonly newDataItem?: NewDataItem | NewDataItemFnAnon | NewDataItemFnParams | NewDataItemFnElement;
  readonly addButton: DynamicMatTableButton | DynamicMatTableLabeledButton;
  //Data Interaction Settings - Delete Variables:
  readonly allowDeleteData = signal<boolean>(false);
  readonly notifyOfDeleteBy: 'subscription' | 'event' = 'event';
  readonly deleteButton: DynamicMatTableButton | DynamicMatTableLabeledButton;
  //Data Interaction Settings - Save Variables:
  readonly allowSaveData = signal<boolean>(false);
  readonly notifySaveBy: 'subscription' | 'event';
  readonly saveMethod: 'pass-data' | 'function';
  readonly saveDataFn?: SaveDataFnElement | SaveDataFnElements;
  readonly saveButton: DynamicMatTableButton | DynamicMatTableLabeledButton;
  constructor(
    columns: ITableColumn[], filterSettings: DynamicMatTableFilter, paginatorSettings: DynamicMatTablePaginator,
    selectionSettings: DynamicMatTableSelection, tableActionSettings: DynamicMatTableActionSettings, readonly tableName: string,
    dataInteractionSettings: DynamicMatTableDataInteractionSettings, readonly allowDragAndDrop: boolean,
    readonly noRecordMessage: string,
  ) {
    this.showFilter = filterSettings.showFilter;
    this.filterType = filterSettings.filterType;
    this.tableColumns = this.createTableColumns(columns, this.filterType);
    this.showPagination = paginatorSettings.showPagination;
    if (this.showPagination) this.paginatorSettings = paginatorSettings.paginatorSettings;
    this.showSelection = signal(selectionSettings.showSelection);
    this.selectionModel = selectionSettings.selectionModel;
    this.showActionColumn = signal(tableActionSettings.showActionColumn);
    if (this.showActionColumn()) {
      this.createActionColumn();
      this.actionOptions = tableActionSettings.actionOptions;
    }

    this.tableName = tableName;
    this.filterOnDataChange = filterSettings.filterOnDataChange;
    this.keepFilters = filterSettings.keepFilters;
    //Data Interaction Settings - Add:
    this.allowAddData = signal(dataInteractionSettings.addSettings.allowAddData);
    this.notifyOfAddBy = dataInteractionSettings.addSettings.notifyOfAddBy;
    this.addDataMethod = dataInteractionSettings.addSettings.addDataMethod;
    this.newDataItem = dataInteractionSettings.addSettings.newDataItem;
    this.addButton = dataInteractionSettings.addSettings.addButton;
    //Data Interaction Settings - Delete:
    this.allowDeleteData = signal(dataInteractionSettings.deleteSettings.allowDeleteData);
    this.notifyOfDeleteBy = dataInteractionSettings.deleteSettings.notifyOfDeleteBy;
    this.deleteButton = dataInteractionSettings.deleteSettings.deleteButton;
    //Data Interaction Settings - Save:
    this.allowSaveData = signal(dataInteractionSettings.saveSettings.allowSave);
    this.notifySaveBy = dataInteractionSettings.saveSettings.notifySaveBy;
    this.saveMethod = dataInteractionSettings.saveSettings.saveMethod;
    this.saveDataFn = dataInteractionSettings.saveSettings.saveDataFn;
    this.saveButton = dataInteractionSettings.saveSettings.saveButton;
    //Allow Drag And Drop:
    this.allowDragAndDrop = allowDragAndDrop;
    this.allowMassUpdate = columns.some(column => column.allowMassUpdate);

    this.noRecordMessage = noRecordMessage;
    if (this.showSelection() && this.selectionModel) this.createSelectionColumn();
    if (this.allowDragAndDrop) this.createDragAndDropColumn();
    this.formFieldColumns = this.tableColumns.filter(column => column.formField);
  }

  createFormControl(defaultValue: any, required: boolean) {
    if (required) {
      return new FormControl(defaultValue, Validators.required)
    }
    return new FormControl(defaultValue)
  }

  private createTableColumns(columns: ITableColumn[], filterType: 'column' | 'simple') {
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
      return new DynamicMatTableColumn(tableColumn);
    });
  }

  private createActionColumn() {
    if (this.actionOptions) {
      let columnHeader = 'Actions';
      let position = this.actionOptions.position;
      if (this.actionOptions.actionHeader) columnHeader = this.actionOptions.actionHeader;
      let filterName = undefined;
      if (this.filterType === 'column') {
        filterName = 'actionsFilter';
        this.filters.splice(position, 0, filterName);
      }
      this.tableColumns.splice(position, 0, new DynamicMatTableColumn({
        columnHeader,
        columnDataName: 'actions',
        columnDataType: 'action',
        sortable: false,
        filterable: false,
        filterName,
        editable: false,
        colClass: {'action-column': true},
        allowMassUpdate: false,
        formField: undefined,
        isLink: false,
      }));
    }
  }

  private createSelectionColumn() {
    let filterName = undefined;
    if (this.filterType === 'column') {
      filterName = 'selectionsFilter';
      this.filters.splice(0, 0, filterName);
    }
    this.tableColumns.splice(0, 0,
      new DynamicMatTableColumn({
        columnHeader: '',
        columnDataName: 'select',
        columnDataType: 'select',
        sortable: false,
        filterable: false,
        filterName,
        editable: false,
        colClass: {'selection-column': true},
        allowMassUpdate: false,
        formField: undefined,
        isLink: false,
      })
    );
  }

  private createDragAndDropColumn() {
    let filterName = undefined;
    if (this.filterType === 'column') {
      filterName = 'dragAndDropFilter';
      this.filters.splice(0, 0, filterName);
    }
    this.tableColumns.splice(0, 0,
      new DynamicMatTableColumn({
        columnHeader: '',
        columnDataName: 'drag',
        columnDataType: 'drag',
        sortable: false,
        filterable: false,
        filterName,
        editable: false,
        allowMassUpdate: false,
        formField: undefined,
        isLink: false,
      })
    );
  }

}