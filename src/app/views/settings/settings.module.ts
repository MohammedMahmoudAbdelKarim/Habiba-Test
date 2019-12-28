// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Settings  Routing
import { SettingsRoutingModule } from './settings-routing.module';
// Ngx-Bootstrap
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
// Solvers
import { branchesAllSolver } from '../../resolvers/branches-index.solver';
import { usersAllSolver } from '../../resolvers/users-index.solver';
import { citySolver } from '../../resolvers/cities.solver';
import { categoriesAllSolver } from '../../resolvers/categories-index.solver';
import { StonesAllSolver } from '../../resolvers/stones-index.solver';
// Components
import { BranchesComponent } from './branches.component';
import { BranchDetailsComponent } from './branch-details.component';
import { StonesComponent } from './stones.component';
import { CategoriesComponent } from './categories.component';
import { UsersComponent } from './users.component';
// Angular Material
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
@NgModule({
  imports: [
    CommonModule,
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
    SettingsRoutingModule,
    AlertModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [
    BranchesComponent,
    StonesComponent,
    CategoriesComponent,
    BranchDetailsComponent,
    UsersComponent
  ],
  providers: [
    branchesAllSolver,
    citySolver,
    StonesAllSolver,
    categoriesAllSolver,
    usersAllSolver
  ]
})
export class SettingsModule {}
