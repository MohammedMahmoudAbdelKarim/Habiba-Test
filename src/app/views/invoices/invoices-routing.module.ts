import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlagsComponent } from './flags.component';
import { FontAwesomeComponent } from './font-awesome.component';
import { SimpleLineIconsComponent } from './simple-line-icons.component';
import { InvoicesComponent } from './invoices.component';
import { salesAllSolver } from '../../resolvers/sales-index.solver';
import { branchListSolver } from '../../resolvers/branch-list.solver';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Invoices'
    },
    children: [
      {
        path: '',
        redirectTo: 'invoices'
      },
      {
        path: 'invoices-list',
        component: InvoicesComponent,
        data: {
          title: 'Invoices'
        },
        resolve: {
          sales: salesAllSolver,
          branchList: branchListSolver
        }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicesRoutingModule {}
