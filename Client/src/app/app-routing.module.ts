import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundComponent } from './not-found.component';


const routes: Routes = [
  {
    path: 'health',
    loadChildren: () => import('./health/health.module').then(m => m.HealthModule)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'health'
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
