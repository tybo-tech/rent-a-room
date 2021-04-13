import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', loadChildren: () => import('src/app/views/home/home.module').then(m => m.HomeModule) },
  { path: 'dashboard', loadChildren: () => import('src/app/views/dashboard/dashboard.module').then(m => m.DashboardModule) }

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
