import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Screen, ScreenSingle } from '../model/screen';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {
  url = "/api/v1/screen";
  constructor(private api: ApiService) { }

  getAll(): Observable<Screen[]> {
    return this.api.get(this.url);
  }

  getSingle(id:string): Observable<ScreenSingle> {
    return this.api.get(this.url + "/" + id);
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
}
