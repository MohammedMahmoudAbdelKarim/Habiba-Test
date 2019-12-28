import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TypographyComponent } from './typography.component';
import { ClientsListComponent } from './clients-list.component';
import { clientsAllSolver } from '../../resolvers/clients-index.solver';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Clients'
    },
    children: [
      {
        path: 'clients',
        redirectTo: 'client-list'
      },
      {
        path: 'client-list',
        component: ClientsListComponent,
        data: {
          title: 'Clients List'
        },
        resolve: {
          clients: clientsAllSolver
        }
      },
      {
        path: 'typography',
        component: TypographyComponent,
        data: {
          title: 'Typography'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule {}
