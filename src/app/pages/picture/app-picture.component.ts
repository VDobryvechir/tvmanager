import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Media } from '../../model/media';
import { AppLoaderComponent } from '../../components/loader/loader.component';
import { PageMessageComponent } from '../../components/page-message/page-message.component';
import { PictureService } from '../../services/picture.service';
import { Subscription } from 'rxjs';
import { AddButtonComponent } from '../../components/add-button/add-button.component';
import { PictureViewComponent } from './view/picture-view.component';
import { VideoService } from '../../services/video.service';

@Component({
  selector: 'app-picture',
  standalone: true,
  imports: [
    AppLoaderComponent, 
    PageMessageComponent, 
    AddButtonComponent,
    PictureViewComponent,
  ],
  templateUrl: './app-picture.component.html',
  styleUrl: './app-picture.component.less'
})
export class AppPictureComponent implements OnInit, OnDestroy{
  @Input() loaderMessage: string = "Bilder side lasting";
  @Input() kind: string = "picture";
  @Input() creationMessage = "Lag et nytt bild";
  @Input() emptyMessage: string[] = ['Ingen bilder ennå','','Du kan legge til nye bilder ved å klikke på plussikonet ovenfor.'];


  pool: Media[] | undefined;

  unsubscribeQuery!: Subscription;
  
  constructor(private pictureService: PictureService,
              private videoService: VideoService,
  ) {

  }

  ngOnDestroy(): void {
    this.unsubscribeQuery && this.unsubscribeQuery.unsubscribe();
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.unsubscribeQuery  && this.unsubscribeQuery.unsubscribe();
    const api= this.kind === "picture" ? this.pictureService.getAll() : this.videoService.getAll(); 
    this.unsubscribeQuery = api.subscribe((pool)=>{
        this.pool = pool;
    });
  }

  
}
