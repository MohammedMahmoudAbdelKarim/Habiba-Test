import { OptionsRoutingModule } from './options-routing.module';
import { OptionsComponent } from './options.component';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {
  ModalModule,
  TabsModule,
  CarouselModule,
  CollapseModule,
  PaginationModule,
  PopoverModule,
  ProgressbarModule,
  TooltipModule
} from 'ngx-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    OptionsRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ModalModule.forRoot(),
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    AutoCompleteModule,
    MatCheckboxModule,
    DropdownModule,
    MatIconModule,
    BsDropdownModule.forRoot(),
    TabsModule,
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot()
  ],
  declarations: [OptionsComponent]
})
export class OptionsModule {}
