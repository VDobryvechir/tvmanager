import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Media } from '../model/media';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PictureService {
  url = "/api/v1/picture";
  constructor(private api: ApiService) { }

  getAll(): Observable<Media[]> {
    return this.api.get(this.url);
  }

  post(media: Media): Observable<Media> {
    return this.api.post(this.url, media);
  }

  deleteItem(id: string): Observable<any> {
    return this.api.delete(this.url + "/" + id);
  }
}
