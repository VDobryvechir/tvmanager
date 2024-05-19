import { Component, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Media } from '../../../model/media';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { PictureService } from '../../../services/picture.service';
import { VideoService } from '../../../services/video.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'group-view',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './group-view.component.html',
  styleUrl: './group-view.component.less'
})
export class GroupViewComponent implements OnDestroy {
  @Input() pool!: Media;
  @Input() kind: string = "picture";
  @Output() refresh: EventEmitter<void> = new EventEmitter();
  @Input() root: string = '';

  unsubscribeQuery!: Subscription;

  constructor(private pictureService: PictureService,
              private videoService: VideoService,
  ) {

  }

  ngOnDestroy(): void {
    this.unsubscribeQuery && this.unsubscribeQuery.unsubscribe();  
  }

  remove(): void {
    if (!this.pool || !this.pool.id) {
      return;
    }
    const api = this.kind === "picture" ? this.pictureService.deleteItem(this.pool.id) : this.videoService.deleteItem(this.pool.id);
    this.unsubscribeQuery = api.subscribe(()=>{
      this.refresh.emit();
    });

  }
}
