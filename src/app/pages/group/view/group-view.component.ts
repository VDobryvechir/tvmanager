import { Component, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Group } from '../../../model/group';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { GroupService } from '../../../services/group.service';

@Component({
  selector: 'group-view',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './group-view.component.html',
  styleUrl: './group-view.component.less'
})
export class GroupViewComponent implements OnDestroy {
  @Input() pool!: Group;
  @Output() refresh: EventEmitter<void> = new EventEmitter();

  unsubscribeQuery!: Subscription;

  constructor(private groupService: GroupService,
  ) {

  }

  ngOnDestroy(): void {
    this.unsubscribeQuery && this.unsubscribeQuery.unsubscribe();  
  }

  remove(): void {
    if (!this.pool || !this.pool.id) {
      return;
    }
    const api$ = this.groupService.deleteItem(this.pool.id);
    this.unsubscribeQuery = api$.subscribe(()=>{
      this.refresh.emit();
    });

  }
}
