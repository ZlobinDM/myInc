
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/videos/all', pathMatch: 'full' },
  { path: 'videos', loadChildren: () => import('./videos/videos.module').then(m => m.VideosModule) },
  { path: '**', redirectTo: '/videos/all' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
