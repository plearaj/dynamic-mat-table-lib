import {FormControl, FormGroup} from "@angular/forms";
import {Dialog, ITableColumn} from "./dynamic-mat-table.model";
import {Signal, signal, WritableSignal} from "@angular/core";

export class DynamicMatTableColumn {
  readonly columnHeader: WritableSignal<string>;
  readonly columnDataName: WritableSignal<string>;
  readonly columnDataType: WritableSignal<string>;
  readonly sortable: boolean;
  readonly filterable: WritableSignal<boolean>;
  readonly filterName: WritableSignal<string>;
  // readonly filterFormControl?: FormControl | FormGroup;
  readonly editable: WritableSignal<boolean>;
  readonly formField: any;
  readonly isLink: WritableSignal<boolean>;
  readonly formGroup?: FormGroup;
  readonly colClass?: WritableSignal<Record<string, boolean>>;
  readonly cellClass?: (element: any) => string | WritableSignal<string> | Signal<string>;
  readonly url?: (element: any) => string  | WritableSignal<string> | Signal<string>;
  readonly dialog?: Dialog;
  readonly allowMassUpdate: boolean;
  objectPropToDisplay?: string;

  constructor(column: ITableColumn) {
    this.columnHeader = signal(column.columnHeader);
    this.columnDataName = signal(column.columnDataName);
    this.columnDataType = signal(column.columnDataType);
    this.sortable = column.sortable;
    this.filterable = signal(column.filterable);
    this.filterName = signal(column.columnHeader + 'Filter');
    // if (column.filterable && column.filterFormControl) {
    //   this.filterFormControl = column.filterFormControl;
    // }
    this.editable = signal(column.editable);
    if (column.editable) {
      //Create FromField
    }
    this.isLink = signal(column.isLink);
    if (column.colClass) this.colClass = signal(column.colClass);
    if (column.cellClass) this.cellClass = column.cellClass
    this.url = column.url;
    this.dialog = column.dialog;
    this.allowMassUpdate = column.allowMassUpdate;
    this.objectPropToDisplay = column.objectPropToDisplay;
    // let cellType = 'simple';
    // switch (column.columnDataType) {
    //   case "action":
    //     cellType = 'action';
    //     break;
    //   case "object":
    //     cellType = 'object';
    //     break;
    //   case "select":
    //     cellType = 'select';
    //     break;
    //   case "date":
    // }
    // this.cellType.set(cellType);
  }
}
