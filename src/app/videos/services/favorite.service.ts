import { Video } from './../models/video.interface';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  public favoriteMap = new Map<string, {
    title: string;
    img: string;
    favorite: boolean;
  }>();
  private storageName = 'favorite';

  constructor() {
    this.loadFromStorage();
  }

  loadFromStorage() {
    const list = JSON.parse(localStorage.getItem(this.storageName));

    if (list) {
      list.forEach(item => this.favoriteMap.set(item[0], item[1]));
    }
  }

  add(item: Video) {
    if (this.favoriteMap.has(item.id)) {
      return;
    }
    this.favoriteMap.set(item.id, item.value);
    this.saveToStorage();
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.storageName, JSON.stringify([...this.favoriteMap]));
      return true;
    } catch (e) {
      return false;
    }

  }

  getVideosFromMap(): Array<Video> {
    const arr: Array<Video> = [];
    this.favoriteMap.forEach((val: any, key) =>
      arr.push({
        id: key,
        value: {
          title: val.title,
          img: val.img,
          favorite: val.favorite
        }
      } as Video));

    return arr;
  }
}
