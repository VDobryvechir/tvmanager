import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Presentation, PresentationSingle } from '../model/presentation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresentationService {
  url = "/api/v1/presentation";
  constructor(private api: ApiService) { }

  getAll(): Observable<Presentation[]> {
    return this.api.get(this.url);
  }

  getSingle(id:string): Observable<PresentationSingle> {
    return this.api.get(this.url + "/" + id);
  }

  post(presentation: Presentation): Observable<Presentation> {
    return this.api.post(this.url, presentation);
  }

  put(presentation:Presentation): Observable<Presentation> {
    return this.api.put(this.url, presentation);
  }

  deleteItem(id: string): Observable<any> {
    return this.api.delete(this.url + "/" + id);
  }
}
