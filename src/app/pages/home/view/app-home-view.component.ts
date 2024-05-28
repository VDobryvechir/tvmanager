import { Component, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Task } from '../../../model/task';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-home-view',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './app-home-view.component.html',
  styleUrl: './app-home-view.component.less'
})
export class AppHomeViewComponent implements OnDestroy {
  @Input() pool!: Task;
  @Output() refresh: EventEmitter<void> = new EventEmitter();

  unsubscribeQuery!: Subscription;

  constructor(private taskService: TaskService,
  ) {

  }

  ngOnDestroy(): void {
    this.unsubscribeQuery && this.unsubscribeQuery.unsubscribe();  
  }

  remove(): void {
    if (!this.pool || !this.pool.id) {
      return;
    }
    const api$ = this.taskService.deleteItem(this.pool.id);
    this.unsubscribeQuery = api$.subscribe(()=>{
      this.refresh.emit();
    });

  }
}
