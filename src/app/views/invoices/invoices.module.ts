import { InvoicesComponent } from './invoices.component';
import { NgModule } from '@angular/core';

import { FlagsComponent } from './flags.component';
import { FontAwesomeComponent } from './font-awesome.component';
import { SimpleLineIconsComponent } from './simple-line-icons.component';
import { InvoicesRoutingModule } from './invoices-routing.module';
import {
  BsDropdownModule,
  ModalModule,
  TabsModule,
  PaginationModule
} from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { salesAllSolver } from '../../resolvers/sales-index.solver';
import { branchListSolver } from '../../resolvers/branch-list.solver';
import { clientsListSolver } from '../../resolvers/clientsList.solver';

@NgModule({
  imports: [
    InvoicesRoutingModule,
    BsDropdownModule.forRoot(),
    FormsModule,
    CommonModule,
    MatNativeDateModule,
    NgxPaginationModule,
    ModalModule.forRoot(),
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    AutoCompleteModule,
    MatCheckboxModule,
    DropdownModule,
    BsDropdownModule.forRoot(),
    TabsModule,
    PaginationModule.forRoot()
  ],
  declarations: [
    InvoicesComponent,
    FlagsComponent,
    FontAwesomeComponent,
    SimpleLineIconsComponent
  ],
  providers: [salesAllSolver, branchListSolver, clientsListSolver]
})
export class InvoicesModule {}
