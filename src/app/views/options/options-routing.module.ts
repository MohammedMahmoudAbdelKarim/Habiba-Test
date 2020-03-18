import { optionSolver } from './../../resolvers/otpions.solver';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OptionsComponent } from './options.component';

const routes: Routes = [
  {
    path: '',
    component: OptionsComponent,
    data: {
      title: 'Options'
    },
    resolve: {
      options: optionSolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OptionsRoutingModule {}
