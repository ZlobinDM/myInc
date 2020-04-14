import { MaterialModule } from './../share/material.module';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoSearchComponent } from './components/video-search/video-search.component';
import { VideoListComponent } from './components/video-list/video-list.component';
import { HttpClientModule } from '@angular/common/http';
import { YoutubeDataService } from './services/youtube-data.service';


const routes: Routes = [
  { path: '', redirectTo: 'all' },
  { path: ':page', component: VideoSearchComponent },
  { path: '**', redirectTo: 'all', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    VideoSearchComponent,
    VideoListComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    YoutubeDataService
  ]
})
export class VideosModule { }
