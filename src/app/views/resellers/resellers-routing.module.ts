import { clientsListSolver } from './../../resolvers/clientsList.solver';
import { branchListSolver } from './../../resolvers/branch-list.solver';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResllersComponent } from './resellers.component';
import { ResellersSolver } from '../../resolvers/resellers-index.solver';
import { resellerClientsSolver } from '../../resolvers/clientsReseller.solver';

const routes: Routes = [
  {
    path: '',
    component: ResllersComponent,
    data: {
      title: 'Resellers'
    },
    resolve: {
      resellers: ResellersSolver,
      branches: branchListSolver,
      clients: resellerClientsSolver,
      realClients: clientsListSolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResllersRoutingModule { }
