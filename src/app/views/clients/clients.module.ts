import { ClientsListComponent } from './clients-list.component';
// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TypographyComponent } from './typography.component';
import { ClientsRoutingModule } from './clients-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AlertModule, ModalModule } from 'ngx-bootstrap';
import { clientsAllSolver } from '../../resolvers/clients-index.solver';

// Theme Routing

@NgModule({
  imports: [
    CommonModule,
    ClientsRoutingModule,
    MatIconModule,
    MatNativeDateModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule,
    AlertModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [ClientsListComponent, TypographyComponent],
  providers: [clientsAllSolver]
})
export class ClientsModule {}
