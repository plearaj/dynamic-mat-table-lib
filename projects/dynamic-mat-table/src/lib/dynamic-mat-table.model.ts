import {SelectionModel} from "@angular/cdk/collections";
import {FormControl, FormGroup} from "@angular/forms";
import {ComponentType} from "@angular/cdk/portal";
import {MatDialogConfig} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";

export interface TableColumn {
  columnHeader: string;
  columnDataName: string;
  columnDataType: 'string' | 'date' | 'dateRange' | 'dateString' | 'number' | 'boolean' | 'action' | 'select' | 'hyperlink' | 'routerLink' | 'routerLinkCell' | 'dialog' | 'dialogCell' | 'dialogIcon' | 'dialogForm' | 'dialogFormIcon' | 'clickableCell' | 'drag' | 'object' | 'variableUrl';
  sortable: boolean;
  filterable: boolean;
  filterName?: string;
  filterFormControl?: FormControl;
  editable: boolean;
  formField: any;
  isLink: boolean;
  formGroup: FormGroup;
  colClass?: Record<string, boolean>;
  cellClass?: (element: any) => string;
  url?: (element: any) => string;
  dialog?: Dialog;
  allowMassUpdate: boolean;
  objectPropToDisplay?: string;
}

export interface Dialog {
  component: ComponentType<unknown>;
  config?: MatDialogConfig;
  icon?: Icon;
  afterClosedFn?: (data: any) => {[key: string]: any}[];
  dataFn?: (element: any) => any;
}

export interface PaginatorSettings {
  pageSize: number;
  pageSizeOptions?: number[];
  hidePageSize: boolean;
  length?: number;
  showFirstLastButtons: boolean;
  allowMaxLength?: boolean;
}

export interface ActionSettings {
  actionHeader?: string;
  actionType: 'single' | 'menu' | 'edit' | 'variable' | 'link' | 'dialog' | 'delete';
  singleIconFn?: (element: any) => Icon;
  routeSegments?: string[];
  position: number;
  singleIcon?: Icon;
  menuIconColor?: 'default' | 'primary' | 'accent' | 'warn' | 'emphasis' | 'error' | 'success' | 'info';
  variableActionFn?: (element: any) => 'single' | 'menu' | 'edit' | 'link' | 'dialog' | 'none';
  menuIconFn?: (element: any) => Button[];
}

export interface Icon {
  name: string;
  color: 'default' | 'primary' | 'accent' | 'warn' | 'emphasis' | 'error' | 'success' | 'info';
  size?: string;
}

export interface Button {
  iconType: 'labled' | 'icon' | 'none';
  buttonText: string;
  buttonColor: 'default' | 'primary' | 'accent' | 'warn' | 'emphasis' | 'error' | 'success' | 'info';
  buttonIcon?: {icon: Icon, position: 'before' | 'after';};
}

export interface TableState {
  viewSort: MatSort;
  viewFilter: Map<string, { dataType: string, filterValue: string }>;
  viewPage: number;
  viewPageSize: number;
}
