import { Component, OnDestroy, OnInit } from '@angular/core';
import { Tvpc } from '../../../model/tvpc';
import { TvpcService } from '../../../services/tvpc.service';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppLoaderComponent } from '../../../components/loader/loader.component';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { SaveFooterComponent } from '../../../components/save-footer/save-footer.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'tvpc-detail',
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
  templateUrl: './tvpc-detail.component.html',
  styleUrl: './tvpc-detail.component.less'
})
export class TvpcDetailComponent implements OnInit, OnDestroy{
  pool: Tvpc | undefined;
  unsubscribeQuery!: Subscription;
  nameTitle: string = "TV pc navn";

  constructor(private tvpcService: TvpcService,
    private route: ActivatedRoute,
    private router: Router, 
  ) {

  }

  save(): void {
    if (!this.pool) {
      return;
    }
    this.pool.name = (this.pool.name || '').trim();
    this.pool.url = (this.pool.url || '').trim();
    if (!this.pool.name) {
      this.tvpcService.api.showErrorMessage("navn må angis");
      return;
    }
    if (!this.pool.url) {
      this.tvpcService.api.showErrorMessage("url må angis");
      return;
    }
    if (this.pool.url.includes(' ')) {
      this.tvpcService.api.showErrorMessage("url kan ikke inneholde romtegn");
      return;
    }
    let body = this.pool;
    const api$ = this.pool.id ? this.tvpcService.put(body) : this.tvpcService.post(body);
    this.unsubscribeQuery = api$.subscribe(()=>{
      this.router.navigate(["/tvpc"], { relativeTo: this.route });
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
    if (id === 'new') {
      this.pool = this.tvpcService.getNew();
    } else {
      const api$ = this.tvpcService.getSingle(id);
      this.unsubscribeQuery = api$.subscribe((pool)=>{
        this.pool = pool;
      });
    } 
  }
}
