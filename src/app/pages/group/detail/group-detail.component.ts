import { Component, OnDestroy, OnInit } from '@angular/core';
import { Group } from '../../../model/group';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppLoaderComponent } from '../../../components/loader/loader.component';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { SaveFooterComponent } from '../../../components/save-footer/save-footer.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../../../services/group.service';

@Component({
  selector: 'group-detail',
  standalone: true,
  imports: [
    MatIconModule, 
    MatInputModule, 
    MatFormFieldModule, 
    AppLoaderComponent,
    MatButtonModule,
    FormsModule,
    SaveFooterComponent,
  ],
  templateUrl: './group-detail.component.html',
  styleUrl: './group-detail.component.less'
})
export class GroupDetailComponent implements OnInit, OnDestroy{
  pool: Group | undefined;
  unsubscribeQuery!: Subscription;
  
  constructor(private groupService: GroupService,
    private route: ActivatedRoute,
    private router: Router, 
  ) {

  }

  save(): void {
    if (!this.pool || !this.pool.name) {
      return;
    }
    let body: Group = {
      id: this.pool.id,
      name: this.pool.name,
      tvpc: this.groupService.convertOwnToIdList(this.pool.tvpcIncluded || []),
    };
    const api$ = body.id ? this.groupService.put(body) : this.groupService.post(body);
    this.unsubscribeQuery = api$.subscribe(()=>{
      this.router.navigate(["/group" ], { relativeTo: this.route });
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
    const api$ = id === 'new' ? this.groupService.getNew() : this.groupService.getSingleTranformed(id);
    this.unsubscribeQuery = api$.subscribe((pool)=>{
        this.pool = pool;
    });
 }
 
 joinPc(id: string | undefined): void {
  if (!id || !this.pool || !this.pool.tvpcExcluded || !this.pool.tvpcIncluded) {
    return;
  }
  const itemIndex = this.pool.tvpcExcluded.findIndex((item)=> item.id===id);
  if (itemIndex<0) {
      return;
  }       
  const item = this.pool.tvpcExcluded[itemIndex];
  if (item) {
      this.pool.tvpcIncluded.push(item);
  }
  this.pool.tvpcExcluded.splice(itemIndex, 1);
 }

 removePc(id: string | undefined): void {
  if (!id || !this.pool || !this.pool.tvpcExcluded || !this.pool.tvpcIncluded) {
    return;
  }
  const itemIndex = this.pool.tvpcIncluded.findIndex((item)=> item.id===id);
  if (itemIndex<0) {
      return;
  }       
  const item = this.pool.tvpcIncluded[itemIndex];
  if (item) {
      this.pool.tvpcExcluded.push(item);
  }
  this.pool.tvpcIncluded.splice(itemIndex, 1);
 }

}
