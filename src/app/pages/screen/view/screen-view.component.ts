import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ScreenService } from '../../../services/screen.service';
import { Subscription } from 'rxjs';
import { Screen } from '../../../model/screen';

@Component({
  selector: 'app-screen-view',
  standalone: true,
  imports: [FormsModule, MatIconModule, RouterLink],
  templateUrl: './screen-view.component.html',
  styleUrl: './screen-view.component.less'
})
export class ScreenViewComponent implements OnDestroy {
    @Input() pool!: Screen;
    @Input() kind: string = "edit_delete";
    @Input() root: string = "";

    @Output() refresh: EventEmitter<string> = new EventEmitter();

    unsubscribeQuery: Subscription | undefined;

    constructor(private screenService: ScreenService) {

    }

    ngOnDestroy(): void {
      this.unsubscribeQuery?.unsubscribe();
    }

    remove(): void {
      if (!this.pool?.id) {
        return;
      }
      if (this.kind === "edit_delete") {
        const api$ = this.screenService.deleteItem(this.pool.id);
        this.unsubscribeQuery = api$.subscribe(()=>{
          this.refresh.emit("");
        });
      } else {
        this.refresh.emit("r"+this.pool.id);
      }
    } 

    sendUpDuration(): void {
      this.refresh.emit("r"+this.pool.id + "_" + this.pool.duration);
    }
}
