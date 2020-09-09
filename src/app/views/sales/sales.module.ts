import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
// Ngx-Bootstrap
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
// Components
import { SafeBoxComponent } from './safe-box.component';
import { ReturnComponent } from './return.component';
import { MakeNewSaleComponent } from './make-new-sale.component';
import { SafeBoxActionComponent } from './safe-box-action.component';
import { SalesListComponent } from './sales-list.component';
// Sales Routing
import { SalesRoutingModule } from './sales-routing.module';
// Angular Material
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
// PrimeNG
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
// Solvers
import { clientsListSolver } from '../../resolvers/clientsList.solver';
import { branchListSolver } from '../../resolvers/branch-list.solver';
import { productsAllSolver } from '../../resolvers/products-index.solver';
import { citySolver } from '../../resolvers/cities.solver';
import { salesAllSolver } from '../../resolvers/sales-index.solver';
import { ReceiptsAllSolver } from '../../resolvers/receipts-index.solver';
import { safeBoxActionsSolver } from '../../resolvers/safe-box-actions.solver';
import { safeboxIndexSolver } from '../../resolvers/safe-box-index.solver';
import { metalSolver } from './../../resolvers/metal.solver';

@NgModule({
  imports: [
    CommonModule,
    SalesRoutingModule,
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
    SalesListComponent,
    MakeNewSaleComponent,
    SafeBoxComponent,
    SafeBoxActionComponent,
    ReturnComponent
  ],
  providers: [
    clientsListSolver,
    branchListSolver,
    productsAllSolver,
    citySolver,
    salesAllSolver,
    ReceiptsAllSolver,
    safeBoxActionsSolver,
    metalSolver,
    safeboxIndexSolver
  ]
})
export class SalesModule { }
