import { ReportComponent } from './report.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Solvers
import { citySolver } from './../../resolvers/cities.solver';
import { branchesAllSolver } from './../../resolvers/branches-index.solver';
import { categoriesAllSolver } from '../../resolvers/categories-index.solver';
import { StonesAllSolver } from '../../resolvers/stones-index.solver';
import { usersAllSolver } from '../../resolvers/users-index.solver';
// Components
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Reports'
    },
    children: [
      {
        path: '',
        component: ReportComponent
        // resolve: {
        //   PDF: PDFproductsAllSolver
        // }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {}
