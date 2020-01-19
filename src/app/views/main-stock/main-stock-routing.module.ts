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
// Components
import { TransferComponent } from './transfer.component';
import { StockListComponent } from './stock-list.component';
import { AddNewItemComponent } from './add-new-item.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Main Stock'
    },
    children: [
      {
        path: '',
        redirectTo: 'stock-list'
      },
      {
        path: 'stock-list',
        component: StockListComponent,
        data: {
          title: 'Stock List'
        },
        resolve: {
          productsData: productsAllSolver,
          categoryList: categoryListSolver,
          branchList: branchListSolver,
          statusList: statusListSolver,
          stones: StonesAllSolver,
          clients: clientsListSolver
        }
      },
      {
        path: 'add-new-item',
        component: AddNewItemComponent,
        data: {
          title: 'Add New Item'
        },
        resolve: {
          categoryList: categoryListSolver,
          branchList: branchListSolver,
          stoneList: stoneListSolver,
          city: citySolver,
          metal: metalSolver
        }
      },
      {
        path: 'transfer',
        component: TransferComponent,
        data: {
          title: 'Transfer List'
        },
        resolve: {
          transfers: transferAllSolver,
          categoryList: categoryListSolver,
          branchList: branchListSolver,
          statusList: statusListSolver,
          stones: StonesAllSolver
        }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule {}
