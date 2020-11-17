import { ClientHistoryComponent } from './client-history.component';
import { clientsListSolver } from './../../resolvers/clientsList.solver';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Solver
import { metalSolver } from './../../resolvers/metal.solver';
import { StonesAllSolver } from './../../resolvers/stones-index.solver';
import { productsAllSolver } from '../../resolvers/products-index.solver';
import { categoryListSolver } from '../../resolvers/category-list.solver';
import { branchListSolver } from '../../resolvers/branch-list.solver';
import { statusListSolver } from '../../resolvers/statusList.solver';
import { stoneListSolver } from '../../resolvers/stoneList.solver';
import { citySolver } from '../../resolvers/cities.solver';
import { transferAllSolver } from '../../resolvers/transfer-index.solver';
import { clientsHistorySolver } from '../../resolvers/clients-history.solver';
// Components
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Client History'
    },
    children: [
      {
        path: '',
        component: ClientHistoryComponent,
        data: {
          title: 'Client History'
        },
        resolve: {
          productsData: productsAllSolver,
          categoryList: categoryListSolver,
          branchList: branchListSolver,
          statusList: statusListSolver,
          stones: stoneListSolver,
          clients: clientsListSolver,
          history: clientsHistorySolver
        }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientHistoryRoutingModule {}
