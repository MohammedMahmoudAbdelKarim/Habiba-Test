import { categoryListSolver } from './../../resolvers/category-list.solver';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
// Ngx-Boostrap
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
// Base Routing
import { BaseRoutingModule } from './main-stock-routing.module';
// Angualr Material
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
// PrimeNG
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
// Solver
import { productsAllSolver } from '../../resolvers/products-index.solver';
import { branchListSolver } from '../../resolvers/branch-list.solver';
import { statusListSolver } from '../../resolvers/statusList.solver';
import { stoneListSolver } from '../../resolvers/stoneList.solver';
import { citySolver } from '../../resolvers/cities.solver';
import { StonesAllSolver } from '../../resolvers/stones-index.solver';
import { transferAllSolver } from '../../resolvers/transfer-index.solver';
import { metalSolver } from '../../resolvers/metal.solver';

// Components
import { StockListComponent } from './stock-list.component';
import { stockListEditComponent } from './stock-list-edit.component';
import { StockListDetailsComponent } from './stock-list-details.component';
import { AddNewItemComponent } from './add-new-item.component';
import { TransferComponent } from './transfer.component';
@NgModule({
  imports: [
    CommonModule,
    MatNativeDateModule,
    NgxPaginationModule,
    ModalModule.forRoot(),
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    AutoCompleteModule,
    MatCheckboxModule,
    DropdownModule,
    BaseRoutingModule,
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
  declarations: [
    StockListComponent,
    stockListEditComponent,
    StockListDetailsComponent,
    AddNewItemComponent,
    TransferComponent
  ],
  providers: [
    MatDatepickerModule,
    productsAllSolver,
    categoryListSolver,
    branchListSolver,
    statusListSolver,
    stoneListSolver,
    citySolver,
    StonesAllSolver,
    transferAllSolver,
    metalSolver
  ]
})
export class MainStockModule {}
