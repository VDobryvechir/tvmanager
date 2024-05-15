import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Tvpc } from '../model/tvpc';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TvpcService {
  url = "/api/v1/tvpc";
  constructor(private api: ApiService) { }

  getAll(): Observable<Tvpc[]> {
    return this.api.get(this.url);
  }

  getSingle(id:string): Observable<Tvpc> {
    return this.api.get(this.url + "/" + id);
  }

  post(tvpc: Tvpc): Observable<Tvpc> {
    return this.api.post(this.url, tvpc);
  }

  put(tvpc:Tvpc): Observable<Tvpc> {
    return this.api.put(this.url, tvpc);
  }

  deleteItem(id: string): Observable<any> {
    return this.api.delete(this.url + "/" + id);
  }
}
