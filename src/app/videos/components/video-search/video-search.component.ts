
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { YoutubeDataService } from '../../services/youtube-data.service';


@Component({
  selector: 'app-video-search',
  templateUrl: './video-search.component.html',
  styleUrls: ['./video-search.component.scss']
})
export class VideoSearchComponent implements OnInit, OnDestroy {

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private youtube: YoutubeDataService
  ) { }

  ngOnInit(): void {

    let page = '';

    this.route.params
      .pipe(
        tap(a => console.log(a)),
        tap(a => page = a.page),
        takeUntil(this.destroy$)
      )
      .subscribe();

    if (page === 'all') {
      this.youtube.getVideos()
        .pipe(
          tap(a => console.log(a)),
          takeUntil(this.destroy$)
        )
        .subscribe();
    }


  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
