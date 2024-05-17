import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppPictureComponent } from '../picture/app-picture.component';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [AppPictureComponent],
  templateUrl: './app-video.component.html',
  styleUrl: './app-video.component.less'
})
export class AppVideoComponent {
  
}
