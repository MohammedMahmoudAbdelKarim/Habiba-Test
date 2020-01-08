import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'main-stock',
        loadChildren: () =>
          import('./views/main-stock/main-stock.module').then(
            m => m.MainStockModule
          )
      },
      {
        path: 'sales',
        loadChildren: () =>
          import('./views/sales/sales.module').then(m => m.SalesModule)
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./views/chartjs/chartjs.module').then(m => m.ChartJSModule)
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then(
            m => m.DashboardModule
          )
      },
      {
        path: 'invoices',
        loadChildren: () =>
          import('./views/invoices/invoices.module').then(m => m.InvoicesModule)
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./views/settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: 'clients',
        loadChildren: () =>
          import('./views/clients/clients.module').then(m => m.ClientsModule)
      },
      {
        path: 'options',
        loadChildren: () =>
          import('./views/options/options.module').then(m => m.OptionsModule)
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
