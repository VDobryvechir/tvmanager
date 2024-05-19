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

  getRootUrl(): string {
    return this.api.getRootUrl();
  }

  getAll(): Observable<Media[]> {
    return this.api.get(this.url);
  }

  getSingle(id: string): Observable<Media> {
    return this.api.get(this.url + "/" + id);
  }

  getNew(): Media {
    return {
      name: "",
      file: ""
    };
  }

  post(media: Media | FormData): Observable<Media> {
    return this.api.post(this.url, media);
  }

  put(media: Media | FormData): Observable<Media> {
    return this.api.put(this.url, media);
  }

  deleteItem(id: string): Observable<any> {
    return this.api.delete(this.url + "/" + id);
  }
}
