import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Presentation, PresentationSingle, PresentationPool } from '../model/presentation';
import { Observable, map, tap } from 'rxjs';
import { Screen } from '../model/screen';
import { Group } from '../model/group';


@Injectable({
  providedIn: 'root'
})
export class PresentationService {
  url = "/api/v1/presentation";
  constructor(private api: ApiService) { }

  getRoot(): string {
    return this.api.getRootUrl();
  }

  getAll(): Observable<PresentationPool> {
    return this.api.get(this.url);
  }

  makeGroupMap(group: Group[]): Map<string, Group> {
    const grpMap = new Map();
    grpMap.set("0", {"id":"0", "name": "Alle pcer"});
    if (group) {
      for(let grp of group) {
        grpMap.set(grp.id, grp);
      }
    }  
    return grpMap;
  }

  makeScreenMap(screen: Screen[]): Map<string, Screen> {
    const scrMap = new Map();
    if (screen) {
      for(let scr of screen) {
        scrMap.set(scr.id, scr);
      }
    }  
    return scrMap;
  }

  makeDurationMap(screen: string[], duration: number[]): Map<string, number> {
    const scrMap = new Map();
    const n = screen.length;
    for(let i=0;i<n;i++) {
      if (!duration[i]) {
        duration[i] = 10;
      }
      scrMap.set(screen[i],duration[i]);
    }
    return scrMap;
  }

  getAllTransformed(): Observable<Presentation[]> {
    return this.getAll().pipe(map(info => {
      const pool = info.pool || [];
      const grpMap = this.makeGroupMap(info.group);
      const scrMap = this.makeScreenMap(info.screen);
      for(let item of pool) {
        const grp = grpMap.get(item.group);
        item.groupInfo = grp ? grp.name : "";
        const n = item.screen?.length || 0;
        let scr = "";
        let cnt = 0;
        for(let i=0;i<n;i++) {
          let scrn = scrMap.get(item.screen[i]);
          if (scrn) {
            scr += (cnt==0?"": ", ") + scrn.name;
            cnt++; 
          }
        }  
        item.screenInfo = scr;
      }
      return pool; 
    }));
  }

  getSingle(id:string): Observable<PresentationSingle> {
    return this.api.get(this.url + "/" + id);
  }

  getNew(): Observable<PresentationSingle> {
    return this.api.get(this.url  + "-new").pipe(tap(info => {
      info.pool = {
        name: "",
        group: "0",
        screen: [],
        duration: [],
      };
      this.provideGroupScreen(info);
    }));
  }

  getSingleTransformed(id:string): Observable<PresentationSingle> {
    return this.getSingle(id).pipe(tap(info => this.provideGroupScreen(info)));
  }

  convertOwnToIdList(screen: Screen[]): string[] {
    return screen.map(item => item.id || "");
  }

  convertOwnToDurationList(screen: Screen[]): number[] {
    return screen.map(item => item.duration || 10);
  }
  
  provideGroupScreen(info: PresentationSingle): void {
    if (!info.group) {
      info.group = [];
    }
    if (!info.screen) {
      info.screen = [];
    }
    info.group.unshift({id: "0", name:"Alle tv pcer"});
    if (!info.pool.screen) {
      info.pool.screen = [];
    }
    if (!info.pool.duration) {
      info.pool.duration = [];
    }

    info.pool.screenIncluded = [];
    info.pool.screenExcluded = [];
    const scrMap = this.makeDurationMap(info.pool.screen, info.pool.duration);
    for(let scr of info.screen) {
      const d = scrMap.get(scr.id || "");
      if (d===undefined) {
         info.pool.screenExcluded.push(scr); 
      } else {
        scr.duration = d;
        info.pool.screenIncluded.push(scr); 
      }
    }    
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
