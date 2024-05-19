import { Component, OnDestroy, OnInit } from '@angular/core';
import { Media } from '../../../model/media';
import { PictureService } from '../../../services/picture.service';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppLoaderComponent } from '../../../components/loader/loader.component';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { SaveFooterComponent } from '../../../components/save-footer/save-footer.component';
import { FileUploaderComponent } from '../../../components/file-uploader/file-uploader.component';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoService } from '../../../services/video.service';

@Component({
  selector: 'presentation-detail',
  standalone: true,
  imports: [
    MatIconModule, 
    MatInputModule, 
    MatFormFieldModule, 
    AppLoaderComponent,
    MatButtonModule,
    FileUploaderComponent,
    FormsModule,
    SaveFooterComponent,
  ],
  templateUrl: './presentation-detail.component.html',
  styleUrl: './presentation-detail.component.less'
})
export class PresentationDetailComponent implements OnInit, OnDestroy{
  pool: Media | undefined;
  kind: string = "picture";
  formData: FormData | undefined;
  unsubscribeQuery!: Subscription;
  nameTitle: string = "";

  constructor(private pictureService: PictureService,
    private videoService: VideoService,
    private route: ActivatedRoute,
    private router: Router, 
  ) {

  }

  save(): void {
    if (!this.pool || !this.pool.name || (!this.pool.file && !this.formData)) {
      return;
    }
    let body: Media | FormData = this.pool;
    if (this.formData) {
      if (this.pool?.id) {
        this.formData.append("id", this.pool.id);
      }
      this.formData.append("name", this.pool.name);
      body = this.formData;
    }
    const api$ = this.pool.id ?
     (this.kind === "picture" ? this.pictureService.put(body) : this.videoService.put(body)): 
     (this.kind === "picture" ?this.pictureService.post(body) : this.videoService.post(body));
    this.unsubscribeQuery = api$.subscribe(()=>{
      this.router.navigate(["/" + this.kind], { relativeTo: this.route });
    });

  }

  updateFile(file: File): void {
    if (file.name && !this.pool?.name) {
      this.pool!.name = file.name; 
    }
    this.formData = new FormData();
    this.formData.append("file", file);
  } 

  ngOnDestroy(): void {
    this.unsubscribeQuery && this.unsubscribeQuery.unsubscribe();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.kind = window.location.href.includes("/picture/") ? "picture" : "video";
    this.nameTitle = this.kind === "picture" ? "Bildenavn" : "Videonavn";

    if (!id) {
      return;
    }
    if (id === 'new') {
      this.pool = this.pictureService.getNew();
    } else {
      const api$ = this.kind === "picture" ? this.pictureService.getSingle(id) : this.videoService.getSingle(id);
      this.unsubscribeQuery = api$.subscribe((pool)=>{
        this.pool = pool;
      });
    } 
  }
}
