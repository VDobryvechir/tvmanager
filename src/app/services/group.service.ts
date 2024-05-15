import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Group, GroupPool, GroupSingle } from '../model/group';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  url = "/api/v1/group";
  constructor(private api: ApiService) { }

  getAll(): Observable<GroupPool> {
    return this.api.get(this.url);
  }

  getSingle(id:string): Observable<GroupSingle> {
    return this.api.get(this.url + "/" + id);
  }

  post(group: Group): Observable<Group> {
    return this.api.post(this.url, group);
  }

  put(group:Group): Observable<Group> {
    return this.api.put(this.url, group);
  }

  deleteItem(id: string): Observable<any> {
    return this.api.delete(this.url + "/" + id);
  }
}