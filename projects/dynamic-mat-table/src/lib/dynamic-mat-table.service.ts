import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {TableSettings} from "./models/table-settings.model";
import {DynamicTable} from "./models/dynamic-mat-table.model";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";

@Injectable({
  providedIn: 'root'
})
export class DynamicMatTableService {
  // private dynamicTable!: DynamicTable;
  // private tableSubject = new BehaviorSubject<DynamicTable | null>(null);
  // table$ = this.tableSubject.asObservable();
  private tableSettingsSubject = new BehaviorSubject<TableSettings | null>(null);
  tableSetting$ = this.tableSettingsSubject.asObservable();
  private dataSourceSubject = new BehaviorSubject<any[] | null>(null);
  dataSource$ = this.dataSourceSubject.asObservable();
  private rowSelectedSubject = new BehaviorSubject<SelectionModel<any>>(new SelectionModel<any>());
  rowSelected$ = this.rowSelectedSubject.asObservable();

  constructor() { }

  // setTable(dynamicTable: DynamicTable) {
  //   this.dynamicTable = dynamicTable;
  //   this.tableSubject.next(dynamicTable);
  // }

  setTableData(data: any[]) {
    this.dataSourceSubject.next(data);
  }

  setTableSettings(tableSettings: TableSettings) {
    this.tableSettingsSubject.next(tableSettings);
  }

  _rowSelected(selection: SelectionModel<any>) {
    this.rowSelectedSubject.next(selection);
  }
}
