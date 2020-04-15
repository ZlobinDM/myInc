import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { tap, takeUntil, pluck, debounceTime, distinctUntilChanged, take, filter, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Video } from './../../models/video.interface';
import { FavoriteService } from './../../services/favorite.service';
import { YoutubeDataService } from '../../services/youtube-data.service';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-video-search',
  templateUrl: './video-search.component.html',
  styleUrls: ['./video-search.component.scss']
})
export class VideoSearchComponent implements OnInit, OnDestroy {

  private destroy$: Subject<boolean> = new Subject<boolean>();

  public videoList: Array<Video> = [];
  public filteredList: Array<Video> = [];
  public nextPageToken = '';

  form: FormGroup = new FormGroup({
    filter: new FormControl(''),
  });

  constructor(
    private router: Router,
    private youtube: YoutubeDataService,
    private fs: FavoriteService
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        tap(a => console.log('router', a)),
        tap((route: NavigationEnd) => this.initData(route.url)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnInit() {

    this.form.controls.filter.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap(str => this.setFilter(str)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  initData(url: string) {

    url = url.replace('/videos/', '');
    this.nextPageToken = '';
    this.videoList = [];

    switch (url) {
      case 'favorite':
        this.videoList = this.fs.getVideosFromMap();
        this.setFilter(this.form.controls.filter.value);
        break;
      default:
        this.loadVideos();
        break;
    }

  }

  loadVideos() {
    console.log('pg tok', this.nextPageToken )
    this.youtube.getVideos(this.nextPageToken)
      .pipe(
        take(1),
        tap(resp => this.nextPageToken = resp.nextPageToken),
        pluck('items'),
        map(list => list.map(item => {
          const img = item.snippet.thumbnails.standard || item.snippet.thumbnails.default;
          const isFav = this.fs.favoriteMap.has(item.id);

          const vid: Video = {
            id: item.id,
            value: {
              title: this.getTitle(item.snippet.title),
              img: img.url,
              favorite: isFav
            }
          };
          return vid;
        })),
        tap(items => this.videoList = [...this.videoList, ...items]),
        tap(() => this.setFilter(this.form.controls.filter.value)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  getTitle(title: string): string {
    return (title.length < 70) ? title : title.substring(0, 70) + '...';
  }

  setFilter(str: string) {

    const inc = this.videoList.filter(video =>
      video.value.title.toLowerCase().includes(str.toLowerCase())
    );

    this.filteredList = [...inc];
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
