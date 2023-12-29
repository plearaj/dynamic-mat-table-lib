import {NewDataItem, NewDataItemFnAnon, NewDataItemFnElement, NewDataItemFnParams} from "./new-data-item.model";
import {DynamicMatTableButton, DynamicMatTableLabeledButton} from "../../dynamic-mat-table-button.model";

export type DynamicMatTableAddByRouting = 'routing';
export class DynamicMatTableAddByNewItem {
  constructor(readonly addDataMethod: 'function' | 'dialog' | 'table', readonly newDataItem: NewDataItem | NewDataItemFnAnon | NewDataItemFnParams | NewDataItemFnElement) {
    this.addDataMethod = addDataMethod;
    this.newDataItem = newDataItem;
  }
}
export class DynamicMatTableDataAddOptions {
  readonly addDataMethod: 'routing' | 'dialog' | 'table' | 'function';
  readonly newDataItem?: NewDataItem | NewDataItemFnAnon | NewDataItemFnParams | NewDataItemFnElement;

  constructor(
    readonly notifyOfAddBy: 'subscription' | 'event',
    addBy: DynamicMatTableAddByRouting | DynamicMatTableAddByNewItem,
    readonly addButton?: DynamicMatTableButton | DynamicMatTableLabeledButton
  ) {
    this.notifyOfAddBy = notifyOfAddBy;
    if (typeof addBy === 'string') {
      this.addDataMethod = addBy;
    } else {
      this.addDataMethod = addBy.addDataMethod;
      this.newDataItem = addBy.newDataItem;
    }

    this.addButton = addButton;
  }
}
export class DynamicMatTableDataAddSettings {
  readonly notifyOfAddBy: 'subscription' | 'event' = 'event';
  readonly addDataMethod: 'routing' | 'dialog' | 'na' | 'table' | 'function' = 'na';
  readonly newDataItem?: NewDataItem | NewDataItemFnAnon | NewDataItemFnParams | NewDataItemFnElement;
  readonly addButton: DynamicMatTableButton | DynamicMatTableLabeledButton = new DynamicMatTableButton('Add');
  constructor(allowAddData: false)
  constructor(allowAddData: true, addDataOptions: DynamicMatTableDataAddOptions)
  constructor(readonly allowAddData: boolean, addDataOptions?: DynamicMatTableDataAddOptions) {
    this.allowAddData = allowAddData;
    if (addDataOptions) {
      this.notifyOfAddBy = addDataOptions.notifyOfAddBy;
      this.addDataMethod = addDataOptions.addDataMethod;
      if (addDataOptions.newDataItem) this.newDataItem = addDataOptions.newDataItem;
      if (addDataOptions.addButton) this.addButton = addDataOptions.addButton;
    }
  }
}
