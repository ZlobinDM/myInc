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
        tap((route: NavigationEnd) => this.initialize(route.url)),
        // tap(() => this.getVideos()),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnInit(): void {

    this.form.controls.filter.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap(str => this.setFilter(str)),
        takeUntil(this.destroy$)
      )
      .subscribe();

  }

  initialize(url: string) {

    url = url.replace('/videos/', '');

    switch (url) {
      case 'favorite':
        this.filteredList = this.fs.getVideosFromMap();
        // const arr: Array<Video> = [];
        console.log(this.fs.favoriteMap); // .forEach((val<{}>, key) => arr.push( {id: key, value: val } )  ;

        break;
      default:
        this.getVideos();
        break;
    }

  }

  getVideos() {
    this.youtube.getVideos(this.nextPageToken)
      .pipe(
        take(1),
        // tap(a => console.log('resp', a)),
        // tap(a => console.log('nextPageToken', this.nextPageToken)),
        tap(resp => this.nextPageToken = resp.nextPageToken),
        pluck('items'),
        // tap(a => console.log('getVids', a)),
        map(list => list.map((item, index) => {
          const img = item.snippet.thumbnails.standard || item.snippet.thumbnails.default;
          const t = {
            id: item.id,
            value: {
              title: this.getTitle(item.snippet.title),
              img: img.url,
              favorite: false
            }
          };
          // console.log(index);
          return t as Video;
        })),
        tap(items => this.videoList = [...this.videoList, ...items]),
        // tap(a => console.log('videoList after', this.videoList)),
        tap(() => this.filteredList = [...this.videoList]),
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
