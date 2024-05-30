import { Component, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { PresentationService } from '../../../services/presentation.service';
import { Subscription } from 'rxjs';
import { Presentation } from '../../../model/presentation';
import { MatDialog } from '@angular/material/dialog';
import { PresentationActivateComponent } from '../activate/presentation-activate.component'

@Component({
  selector: 'presentation-view',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './presentation-view.component.html',
  styleUrl: './presentation-view.component.less'
})
export class PresentationViewComponent implements OnDestroy {
  @Input() pool!: Presentation;
  @Output() refresh: EventEmitter<void> = new EventEmitter();
  @Input() root: string = '';

  unsubscribeQuery!: Subscription;

  constructor(private presentationService: PresentationService,
    public dialog: MatDialog,
  ) {

  }

  ngOnDestroy(): void {
    this.unsubscribeQuery && this.unsubscribeQuery.unsubscribe();  
  }

  remove(): void {
    if (!this.pool || !this.pool.id) {
      return;
    }
    const api$ =  this.presentationService.deleteItem(this.pool.id);
    this.unsubscribeQuery = api$.subscribe(()=>{
      this.refresh.emit();
    });

  }

  activate(): void {
    if (!this.pool || !this.pool.id) {
      return;
    }
    this.dialog.open(PresentationActivateComponent, {
      data: this.pool,
    });
  }

}
