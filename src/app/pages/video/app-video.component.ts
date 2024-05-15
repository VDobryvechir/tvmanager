import { Component, OnDestroy, OnInit } from '@angular/core';
import { Media } from '../../model/media';
import { AppLoaderComponent } from '../../components/loader/loader.component';
import { PageMessageComponent } from '../../components/page-message/page-message.component';
import { VideoService } from '../../services/video.service';
import { Subscription } from 'rxjs';
import { AddButtonComponent } from '../../components/add-button/add-button.component';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [AppLoaderComponent, PageMessageComponent, AddButtonComponent],
  templateUrl: './app-video.component.html',
  styleUrl: './app-video.component.less'
})
export class AppVideoComponent implements OnInit, OnDestroy{
  designTime: boolean = false;
  pool: Media[] | undefined = this.designTime ? [
     {
         id: "378973287932",
         name: "Gruppe at the central plant",
     },
     {
      id: "3784908934",
      name: "Gruppe at the bottom side",
     },
  

  ] : undefined;

  unsubscribeQuery!: Subscription;

  constructor(private videoService: VideoService) {

  }

  ngOnDestroy(): void {
    this.unsubscribeQuery && this.unsubscribeQuery.unsubscribe();
  }

  ngOnInit(): void {
    if (!this.designTime) {
      this.unsubscribeQuery = this.videoService.getAll().subscribe((pool)=>{
        this.pool = pool;
      });
    }
  }
  
}
