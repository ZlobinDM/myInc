import { HttpParams, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class YoutubeDataService {

  apiURL = 'https://www.googleapis.com/youtube/v3/videos';
  appKey = 'AIzaSyAYW1sBcJ6cnqcZfal6mwp064fAi0tfyTU';

  constructor(private http: HttpClient) { }

  getVideos() {

    const params = new HttpParams({
      fromObject: {
        part: 'snippet',
        chart: 'mostPopular',
        regionCode: 'RU',
        key: this.appKey
      }
    });

    return this.http.get<any>(this.apiURL, { params });
  }
}
