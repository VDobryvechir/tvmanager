import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Screen, ScreenSingle } from '../model/screen';
import { Observable, tap } from 'rxjs';
import { AnyMap } from '../model/tvpc';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {
  url = "/api/v1/screen";
  defaultScreen: Screen = {
    name: "",
    picture: "",
    backgroundColor: "#0000ff",
    video: "",
    pictureHeight: 70,
    text: [],
    textPool: "",
    htmlPool: "",
    mode: "text",
    file: "",
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
  };

  constructor(public api: ApiService) { }

  getAll(): Observable<Screen[]> {
    return this.api.get(this.url);
  }

  getSingle(id:string): Observable<ScreenSingle> {
    return this.api.get(this.url + "/" + id).pipe(tap(item => {
      this.provideScreenDefaults(item);
    }
    ));
  }

  getNew(): Observable<ScreenSingle> {
    return this.api.get(this.url + "-new").pipe(tap(item => {
      this.provideScreenDefaults(item);
    }
    ));
  }

  post(screen: Screen): Observable<Screen> {
    return this.api.post(this.url, screen);
  }

  put(screen:Screen): Observable<Screen> {
    return this.api.put(this.url, screen);
  }

  deleteItem(id: string): Observable<any> {
    return this.api.delete(this.url + "/" + id);
  }

  fillDefaultValues(obj: AnyMap, objStandard: AnyMap): void {
    const keys = Object.keys(objStandard);
    for(let key of keys) {
      if (obj[key] === undefined) {
        obj[key] = objStandard[key];
      }
    }
  }

  provideScreenDefaults(item: ScreenSingle): void {
    if (!item.picture) {
      item.picture = [];
    }
    if (!item.video) {
      item.video = [];
    }
    if (!item.pool) {
      item.pool = Object.assign({}, this.defaultScreen);
    } else {
      this.fillDefaultValues(item.pool, this.defaultScreen);
    }
    this.defaultScreen.text = [];
  }

  getRoot(): string {
    return this.api.getRootUrl();
  }
}
