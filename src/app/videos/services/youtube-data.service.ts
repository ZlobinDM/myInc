import { HttpParams, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { YoutubeResponse } from '../models/youtube,interface';

@Injectable({
  providedIn: 'root'
})
export class YoutubeDataService {

  apiURL = 'https://www.googleapis.com/youtube/v3/videos';
  appKey = 'AIzaSyAYW1sBcJ6cnqcZfal6mwp064fAi0tfyTU';

  constructor(private http: HttpClient) { }

  getVideos(pageToken: string = '') {

    const params = new HttpParams({
      fromObject: {
        part: 'snippet',
        chart: 'mostPopular',
        regionCode: 'RU',
        maxResults: '50',
        pageToken,
        key: this.appKey
      }
    });

    return this.http.get<YoutubeResponse>(this.apiURL, { params });
  }
}
