import {Component, computed, EventEmitter, OnDestroy, OnInit, Output, Signal, signal, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {DynamicMatTableService} from "./dynamic-mat-table.service";
import {Subscription} from "rxjs";
import {DynamicMatTableColumn} from "./models/dynamict-mat-table-column.model";
import {TableSettings} from "./models/table-settings.model";
import {PaginatorSettings} from "./models/paginator-settings.model";
import {SelectionModel} from "@angular/cdk/collections";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'htt-dynamic-mat-table',
  templateUrl: './dynamic-mat-table.page.html',
  styleUrls: ['./dynamic-mat-table.page.scss'],
})
export class DynamicMatTablePage implements OnInit, OnDestroy {
  //TableSettings Variables:
  tableSettingsSubscription!: Subscription;
  tableSettings!: TableSettings;
  tableSettingsLoaded = signal<boolean>(false);
  //Table Data Variables:
  dataSubscription!: Subscription;
  datasource = signal<MatTableDataSource<any>>(new MatTableDataSource<any>());
  tableDataLoaded = signal<boolean>(false);
  //Filter Variables:
  showSimpleFilter = signal<boolean>(false);
  simpleFilterControl = new FormControl<string>('');
  showColumnFilter = signal<boolean>(false);
  filterFormGroup!: FormGroup;
  filterColumns = signal<string[]>([]);
  //Table Column Settings:
  displayedColumns = signal<DynamicMatTableColumn[]>([]);
  columns = signal<string[]>([]);
  //Sort Variables:
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  //Paginator Setting Variables
  showPaginator = signal<boolean>(false);
  @ViewChild(MatPaginator, { static: true}) paginator!: MatPaginator;
  paginatorSettings!: PaginatorSettings;
  length = computed<number>(() => {
    return this.datasource().data.length;
  })
  pageSizeOptions!: Signal<number[]>;
  //Selection Model Variables:
  selection = new SelectionModel<any>(true, []);
  @Output() rowSelected = new EventEmitter<SelectionModel<any>>();
  lastChecked!: number;
  //Drag and Drop Variables:
  disableDragAndDrop = true;
  talbeFormArray = new FormArray([]);
  tableFormGroup = new FormGroup({
    talbeFormArray: this.talbeFormArray
  });

  constructor(private dynamicMatTableService: DynamicMatTableService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.tableSettingsSubscription = this.dynamicMatTableService.tableSetting$.subscribe(tableSettings => {
      if (tableSettings) {
        this.tableSettings = tableSettings;
        this.tableSettingsLoaded.set(true);
        //Set Columns:
        this.displayedColumns.set(tableSettings.tableColumns);
        this.columns.set(tableSettings.tableColumns.map(column => column.columnDataName()))

        //Sets Filter Settings:
        if (tableSettings.showFilter) {
          if (tableSettings.filterType === 'simple') {
            //Listen for changes to simple filter if simple filter is set to true:
            this.simpleFiltration();
            this.showSimpleFilter.set(true);
            this.showColumnFilter.set(false);
          } else {
            this.filterFormGroup = tableSettings.filterFormGroup;
            this.showSimpleFilter.set(false);
            this.showColumnFilter.set(true);
          }
        }

        //Sets Paginator Settings:
        if (tableSettings.paginatorSettings) {
          this.showPaginator.set(true);
          this.paginatorSettings = tableSettings.paginatorSettings;
          this.pageSizeOptions = computed<number[]>(() => {
            let pageSizeOptions: number[] = [];
            if (this.paginatorSettings) {
              pageSizeOptions = this.paginatorSettings.pageSizeOptions() as number[];
              if (this.paginatorSettings.allowMaxLength) {
                pageSizeOptions.push(this.datasource().data.length)
              }
            }
            return pageSizeOptions;
          });
        } else {
          this.showPaginator.set(false);
        }

      } else {
        this.tableSettingsLoaded.set(false);
      }
    });
    this.dataSubscription = this.dynamicMatTableService.dataSource$.subscribe(data => {
      if (data) {
        this.tableDataLoaded.set(true);
        this.datasource.mutate(datasource => {
          datasource.data = data;
          // return datasource;
        })
      } else {
        this.tableDataLoaded.set(false);
      }
    });
  }

  simpleFiltration() {
    this.simpleFilterControl.valueChanges.subscribe(simpleFilter => {
      if (simpleFilter) {
        this.datasource().filter = simpleFilter.trim().toLowerCase()
      }
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.datasource().data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.datasource().data.forEach(row => this.selection.deselect(row));
    } else {
      this.datasource().data.forEach(row => this.selection.select(row));
    }
    this.rowSelected.emit(this.selection);
    this.dynamicMatTableService._rowSelected(this.selection);
    return this.datasource;
  }

  selectRowsBetween(start: number, end: number) {
    this.datasource().data.forEach((datum, index) => {
      if (index > start && index < end) {
        this.selection.select(datum);
      }
    });
  }

  checkSelection(start: number, end: number) {
    const selectionData = this.datasource().data.slice(start, end +1);
    const isAllSelected = selectionData.every(row => {
      return this.selection.isSelected(row);
    });
    this.datasource().sortData(this.datasource().data, this.sort);
    if (isAllSelected) {
      this.datasource().data.forEach((data, index) => {
        if (index >= start && index <= end) {
          this.selection.deselect(data);
        }
      });
    } else {
      this.selectRowsBetween(start, end);
    }
  }

  clickHandler(event: any, index: number) {
    if (!this.lastChecked) {
      this.lastChecked = index;
      return;
    }
    if (event.shiftKey) {
      const start = index;
      const end = this.lastChecked;
      if (start > end) {
        this.checkSelection(end, start);
      } else {
        this.checkSelection(start, end)
      }
    }
    this.lastChecked = index;
  }

  trackByIndex(index: number): number {
    return index;
  }

  getCellType(column: DynamicMatTableColumn, element: any) {
    let cellType = 'simple';
    if (column.columnDataType() === 'action') {
      cellType = 'action'
    } else if (column.columnDataType() === '') {

    }
    return signal<string>(cellType);
  }

  addData() {
    let newDataItem: any
    if (this.tableSettings.addDataMethod === 'table' || this.tableSettings.addDataMethod === 'function') {
      if (this.tableSettings.newDataItem && typeof this.tableSettings.newDataItem === 'function') {
        newDataItem = this.tableSettings.newDataItem();
      } else {
        newDataItem = this.tableSettings.newDataItem;
      }
      this.datasource.update((datasource) => {
        datasource.data.push(newDataItem);
        return datasource;
      });
    } else if (this.tableSettings.addDataMethod === 'routing') {
      this.router.navigate([], {relativeTo: this.route});
    } else {

    }
  }

  ngOnDestroy() {
    if (this.tableSettingsSubscription) this.tableSettingsSubscription.unsubscribe();
    if (this.dataSubscription) this.dataSubscription.unsubscribe();
  }

}
