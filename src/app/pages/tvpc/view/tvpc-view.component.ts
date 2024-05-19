import { Component, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Tvpc } from '../../../model/tvpc';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TvpcService } from '../../../services/tvpc.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tvpc-view',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './tvpc-view.component.html',
  styleUrl: './tvpc-view.component.less'
})
export class TvpcViewComponent implements OnDestroy {
  @Input() pool!: Tvpc;
  @Output() refresh: EventEmitter<void> = new EventEmitter();

  unsubscribeQuery!: Subscription;

  constructor(private tvpcService: TvpcService,
  ) {

  }

  ngOnDestroy(): void {
    this.unsubscribeQuery && this.unsubscribeQuery.unsubscribe();  
  }

  remove(): void {
    if (!this.pool || !this.pool.id) {
      return;
    }
    const api$ =  this.tvpcService.deleteItem(this.pool.id);
    this.unsubscribeQuery = api$.subscribe(()=>{
      this.refresh.emit();
    });

  }
}
