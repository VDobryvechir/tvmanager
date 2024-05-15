import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  serverAddress: string = "http://localhost:2024";

  constructor(protected httpClient: HttpClient) { }

  finishUrl(url: string): string {
    return this.serverAddress + url; 
  }

  get(url: string): Observable<any> {
    url = this.finishUrl(url);
    return this.httpClient.get(url);
  }

  post(url: string, data: any): Observable<any> {
    url = this.finishUrl(url);
    return this.httpClient.post(url, data);
  }

  put(url: string, data: any): Observable<any> {
    url = this.finishUrl(url);
    return this.httpClient.put(url, data);
  }

  delete(url: string): Observable<any> {
    url = this.finishUrl(url);
    return this.httpClient.delete(url);
  }

}
