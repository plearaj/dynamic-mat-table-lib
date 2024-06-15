import {InjectionToken, ModuleWithProviders, NgModule} from '@angular/core';
import {MatTableModule} from "@angular/material/table";
import {DynamicMatTableService} from "./dynamic-mat-table.service";
import {DynamicMatTablePage} from "./dynamic-mat-table.page";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatToolbarModule} from "@angular/material/toolbar";
import {DatePipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSortModule} from "@angular/material/sort";
import {
  DynamicMatTableDeleteSettings
} from "./models/dynamic-mat-table-data-interaction-settings/dynamic-mat-table-delete-settings/dyanamic-mat-table-delete-settings.model";
import {MatCardModule} from "@angular/material/card";

export interface LibConfig {
  apiUrl: string;
}

export const LibConfigService = new InjectionToken<LibConfig>('LibConfig');

@NgModule({
  declarations: [
    DynamicMatTablePage
  ],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatToolbarModule,
    NgIf,
    NgForOf,
    IonicModule,
    ReactiveFormsModule,
    MatSortModule,
    DatePipe,
    JsonPipe,
    MatCardModule
  ],
  exports: [
    DynamicMatTablePage
    // MatPaginatorModule,
    // MatTableModule
  ]
})
export class DynamicMatTableModule {
  static forRoot(config: LibConfig): ModuleWithProviders<any> {
    return {
      ngModule: DynamicMatTableModule,
      providers: [
        DynamicMatTableService,
        {
          provide: LibConfigService,
          useValue: config
        }
      ]
    };
  }
}
