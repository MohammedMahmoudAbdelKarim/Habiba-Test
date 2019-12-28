import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Solvers
import { citySolver } from './../../resolvers/cities.solver';
import { branchesAllSolver } from './../../resolvers/branches-index.solver';
import { categoriesAllSolver } from '../../resolvers/categories-index.solver';
import { StonesAllSolver } from '../../resolvers/stones-index.solver';
import { usersAllSolver } from '../../resolvers/users-index.solver';
// Components
import { BranchesComponent } from './branches.component';
import { StonesComponent } from './stones.component';
import { UsersComponent } from './users.component';
import { CategoriesComponent } from './categories.component';
import { BranchDetailsComponent } from './branch-details.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Settings'
    },
    children: [
      {
        path: '',
        redirectTo: 'branches'
      },
      {
        path: 'branches',
        component: BranchesComponent,
        data: {
          title: 'Branches'
        },
        resolve: {
          branches: branchesAllSolver,
          cities: citySolver
        }
      },
      {
        path: 'branches/details',
        component: BranchDetailsComponent,
        data: {
          title: 'Branch Details'
        },
        resolve: {
          branches: branchesAllSolver
        }
      },
      {
        path: 'stones',
        component: StonesComponent,
        data: {
          title: 'Stones'
        },
        resolve: {
          stones: StonesAllSolver
        }
      },
      {
        path: 'categories',
        component: CategoriesComponent,
        data: {
          title: 'Categories'
        },
        resolve: {
          categories: categoriesAllSolver
        }
      },
      {
        path: 'users',
        component: UsersComponent,
        data: {
          title: 'Users'
        },
        resolve: {
          user: usersAllSolver
        }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
