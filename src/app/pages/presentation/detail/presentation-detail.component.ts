import { Component, OnDestroy, OnInit } from '@angular/core';
import { Presentation } from '../../../model/presentation';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppLoaderComponent } from '../../../components/loader/loader.component';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { SaveFooterComponent } from '../../../components/save-footer/save-footer.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PresentationService } from '../../../services/presentation.service';
import { Group } from '../../../model/group';
import { Screen } from '../../../model/screen';
import { ScreenViewComponent } from '../../screen/view/screen-view.component';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'presentation-detail',
  standalone: true,
  imports: [
    AppLoaderComponent,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule, 
    MatIconModule, 
    MatInputModule,
    MatSelectModule, 
    SaveFooterComponent,
    ScreenViewComponent,
  ],
  templateUrl: './presentation-detail.component.html',
  styleUrl: './presentation-detail.component.less'
})
export class PresentationDetailComponent implements OnInit, OnDestroy{
  pool: Presentation | undefined;
  group: Group[] = [];
  root: string;

  unsubscribeQuery!: Subscription;
  
  constructor(private presentationService: PresentationService,
    private route: ActivatedRoute,
    private router: Router, 
  ) {
    this.root = presentationService.getRoot();
  }

  setDurationOrRemove(action: string) {
    if (!action) {
      return;
    }
    const c = action[0];
    action = action.substring(1);
    switch(c) {
      case "r":
        this.removePc(action);
        break;
      case "d":
        const p = action.indexOf("_");
        if (p>0) {
          const id = action.substring(0, p);
          const d = parseInt(action.substring(p+1));
          this.setDuration(id, d);
        } 
        break; 
    }
  }

  setDuration(id: string, value: number): void {
    if (value>0 && this.pool) {
      const item = this.pool.screenIncluded?.find(p => p.id === id);
      if (item) {
        item.duration = value;
      }
    }
  }

  save(): void {
    if (!this.pool || !this.pool.name) {
      return;
    }
    let body: Presentation = {
      id: this.pool.id,
      name: this.pool.name,
      group: this.pool.group,
      screen: this.presentationService.convertOwnToIdList(this.pool.screenIncluded || []),
      duration: this.presentationService.convertOwnToDurationList(this.pool.screenIncluded || []),
    };
    const api$ = body.id ? this.presentationService.put(body) : this.presentationService.post(body);
    this.unsubscribeQuery = api$.subscribe(()=>{
      this.router.navigate(["/presentation" ], { relativeTo: this.route });
    });

  }

  ngOnDestroy(): void {
    this.unsubscribeQuery && this.unsubscribeQuery.unsubscribe();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }
    const api$ = id === 'new' ? this.presentationService.getNew() : this.presentationService.getSingleTransformed(id);
    this.unsubscribeQuery = api$.subscribe((info)=>{
        this.pool = info.pool;
        this.group = info.group;
    });
 }
 
 joinPc(id: string | undefined): void {
  if (!id || !this.pool || !this.pool.screenExcluded || !this.pool.screenIncluded) {
    return;
  }
  const itemIndex = this.pool.screenExcluded.findIndex((item)=> item.id===id);
  if (itemIndex<0) {
      return;
  }       
  const item = this.pool.screenExcluded[itemIndex];
  if (item) {
      this.pool.screenIncluded.push(item);
  }
  this.pool.screenExcluded.splice(itemIndex, 1);
 }

 removePc(id: string | undefined): void {
  if (!id || !this.pool || !this.pool.screenExcluded || !this.pool.screenIncluded) {
    return;
  }
  const itemIndex = this.pool.screenIncluded.findIndex((item)=> item.id===id);
  if (itemIndex<0) {
      return;
  }       
  const item = this.pool.screenIncluded[itemIndex];
  if (item) {
      this.pool.screenExcluded.push(item);
  }
  this.pool.screenIncluded.splice(itemIndex, 1);
 }

}
