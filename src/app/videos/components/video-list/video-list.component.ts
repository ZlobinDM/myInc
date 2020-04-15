import { Video } from './../../models/video.interface';
import { Component, OnInit, Input } from '@angular/core';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {
  @Input() videos: Video;

  constructor(
    private fs: FavoriteService
  ) { }

  ngOnInit(): void {
  }

  addFavorite(video: Video) {
    video.value.favorite = !video.value.favorite;
    this.fs.add(video);
  }

}
