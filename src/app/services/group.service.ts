import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { TvpcService } from './tvpc.service';
import { Group, GroupPool, GroupSingle } from '../model/group';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { StringMap, Tvpc, TvpcMap } from '../model/tvpc';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  url = "/api/v1/group";
  constructor(private api: ApiService,
              private tvpcService: TvpcService,  
  ) { }

  getAll(): Observable<GroupPool> {
    return this.api.get(this.url);
  }

  getAllTransformed(): Observable<Group[]> {
    return this.getAll().pipe(map((pool)=>this.transformAll(pool)));
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

  makeTvcpMap(tvpcs: Tvpc[]): TvpcMap {
    const mp: TvpcMap = {};
    if (tvpcs) {
      for(let i=0;i<tvpcs.length;i++) {
        const item = tvpcs[i];
        if (item.id) {
          mp[item.id] = item;
        }
      }
    }
    return mp;
  }

  makeStringMap(items: string[]): StringMap {
    const mp: StringMap = {};
    if (items) {
      for(let i=0;i<items.length;i++) {
        const item = items[i];
        if (item) {
          mp[item] = item;
        }
      }
    }
    return mp;
  }

  makeTvpcList(tvs: string[], tvmap: TvpcMap): string {
    let res = "";
    for(let i=0;i<tvs.length;i++) {
        if (i) {
          res += ", " + tvmap[tvs[i]].name; 
        } else {
          res = tvmap[tvs[i]].name || "";
        }
    }
    return res;
  }

  transformAll(pool: GroupPool): Group[] {
    const tvmap = this.makeTvcpMap(pool.tvpc);
    const gr: Group[] = pool.pool || [];
    for(let i=0;i<gr.length;i++) {
      const tvs = gr[i].tvpc || [];
      gr[i].tvpcInfo = "(" + tvs.length + ") " + this.makeTvpcList(tvs, tvmap); 
    }
    return gr;
  }

  getNew(): Observable<Group> {
    return this.tvpcService.getAll().pipe(map((tvpcs)=>{
      return {
        name: "",
        tvpcIncluded: [],
        tvpcExcluded: tvpcs || [],
      };
    }))
  }

  convertOwnToIdList(lst: Tvpc[]): string[] {
    return lst.map(item => item.id || "");
  }

  collectExcluded(tvpc: Tvpc[], ids: string[]): Tvpc[] {
    const tvmap = this.makeStringMap(ids);
    return tvpc.filter(item=> !tvmap[item.id || ""]);
  }

  collectIncluded(tvpc: Tvpc[], ids: string[]): Tvpc[] {
    const tvmap = this.makeStringMap(ids);
    return tvpc.filter(item=> tvmap[item.id || ""]);
  }

  getSingleTranformed(id: string): Observable<Group> {
    return this.getSingle(id).pipe(map(pool => {
      return {
        id: pool.pool.id,
        name: pool.pool.name,
        tvpcExcluded: this.collectExcluded(pool.tvpc, pool.pool.tvpc || []),
        tvpcIncluded: this.collectIncluded(pool.tvpc, pool.pool.tvpc || []),
      };
    }));
  }
}
