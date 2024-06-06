import { Component, Output, EventEmitter, Input, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { PresentationService } from '../../../services/presentation.service';
import { Subscription } from 'rxjs';
import { Presentation } from '../../../model/presentation';
import { MatDialog } from '@angular/material/dialog';
import { PresentationActivateComponent } from '../activate/presentation-activate.component'
import { WTaskUnit } from '../../../utils/webgl/wtask-unit';
import { WebglUtils } from '../../../utils/webgl-utils';

@Component({
  selector: 'presentation-view',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './presentation-view.component.html',
  styleUrl: './presentation-view.component.less'
})
export class PresentationViewComponent implements AfterViewInit, OnDestroy {
  @Input() pool!: Presentation;
  @Output() refresh: EventEmitter<void> = new EventEmitter();
  @Input() root: string = '';

  @ViewChild('glcanvas') elem!: ElementRef<HTMLCanvasElement>;
  unsubscribeQuery!: Subscription;
  task?: WTaskUnit;

  constructor(private presentationService: PresentationService,
    public dialog: MatDialog,
  ) {

  }

  ngAfterViewInit(): void {
    this.task = WebglUtils.presentPictureVideosWithDuration(this.pool.files || [], this.pool.duration, this.elem.nativeElement);  
  }

  ngOnDestroy(): void {
    this.task && WebglUtils.finishPictureVideo(this.task);
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
