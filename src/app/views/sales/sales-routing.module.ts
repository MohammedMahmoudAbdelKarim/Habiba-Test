import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Components
import { ReturnComponent } from './return.component';
import { SafeBoxComponent } from './safe-box.component';
import { SafeBoxActionComponent } from './safe-box-action.component';
import { MakeNewSaleComponent } from './make-new-sale.component';
// Solvers
import { citySolver } from './../../resolvers/cities.solver';
import { branchListSolver } from './../../resolvers/branch-list.solver';
import { clientsListSolver } from '../../resolvers/clientsList.solver';
import { SalesListComponent } from './sales-list.component';
import { ReceiptsAllSolver } from '../../resolvers/receipts-index.solver';
import { safeBoxActionsSolver } from '../../resolvers/safe-box-actions.solver';
import { productsAllSolver } from './../../resolvers/products-index.solver';
import { safeboxIndexSolver } from '../../resolvers/safe-box-index.solver';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Sales'
    },
    children: [
      {
        path: '',
        redirectTo: 'sales'
      },
      {
        path: 'sales-list',
        component: SalesListComponent,
        data: {
          title: 'Sales'
        },
        resolve: {
          branchList: branchListSolver,
          receipts: ReceiptsAllSolver
        }
      },
      {
        path: 'make-new-sale',
        component: MakeNewSaleComponent,
        data: {
          title: 'Make New Sale'
        },
        resolve: {
          products: productsAllSolver,
          clients: clientsListSolver,
          branchList: branchListSolver,
          cities: citySolver
        }
      },
      {
        path: 'safe-box-list',
        component: SafeBoxComponent,
        data: {
          title: 'Safe Box List'
        },
        resolve: {
          safeBox: safeboxIndexSolver
        }
      },
      {
        path: 'safe-box-action',
        component: SafeBoxActionComponent,
        data: {
          title: 'Safe Box Action'
        },
        resolve: {
          safeBoxs: safeBoxActionsSolver
        }
      },
      {
        path: 'return',
        component: ReturnComponent,
        data: {
          title: 'Return'
        },
        resolve: {
          products: productsAllSolver,
          clients: clientsListSolver,
          branchList: branchListSolver,
          cities: citySolver
        }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule {}
