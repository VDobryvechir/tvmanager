import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Media } from '../../../model/media';
import { Screen } from '../../../model/screen';
import { SaveFooterComponent } from '../../../components/save-footer/save-footer.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ScreenService } from '../../../services/screen.service';
import ScreenUtils from '../../../utils/screen-utils';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ButtonModule } from 'primeng/button';
import { BehaviorSubject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-screen-detail',
  standalone: true,
  imports: [
    MatTabsModule,
    MatListModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule, 
    SaveFooterComponent,
    ColorPickerModule,
    ButtonModule,
  ],
  templateUrl: './screen-detail.component.html',
  styleUrl: './screen-detail.component.less'
})
export class ScreenDetailComponent implements OnInit {
  
  pool: Screen | undefined;

  videoPool: Media[] = [];
  picturePool: Media[] = [];
  root: string;
  video = new FormControl('',[]);
  picture = new FormControl('',[]);
  destroyRef = inject(DestroyRef);
  modeIndex = 0;
  fullUpdateReady = false;
  debouncedUpdate$ = new BehaviorSubject(null);

  constructor(private screenService: ScreenService,
    private route: ActivatedRoute,
    private router: Router, 
  ) {
    this.root = this.screenService.getRoot();
    ScreenUtils.setRoot(this.root);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }
    const api$ = id === 'new' ? this.screenService.getNew(): this.screenService.getSingle(id);
    api$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((info)=>{
      this.pool = info.pool;
      this.picturePool = info.picture;
      this.videoPool = info.video;
      this.modeIndex = ScreenUtils.getModeIndex(info.pool.mode);
      if (this.pool.video) {
        this.video.setValue(this.pool.video);
      }
      if (this.pool.picture) {
        this.picture.setValue(this.pool.picture);
      }
      ScreenUtils.adjustAllParameters(info.pool, info.video, info.picture);
      setTimeout(this.initiateFullUpdate.bind(this), 300);
    });
    this.video.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(()=>{
      if (this.video.value && this.pool) {
        this.pool.video = this.video.value;
        ScreenUtils.adjustVideoUrl(this.pool, this.videoPool);
      }
    });
    this.picture.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(()=>{
      window.console.log('picture ', this.picture.value, this.pool);
      if (this.picture.value && this.pool) {
        this.pool.picture = this.picture.value;
        ScreenUtils.adjustPictureUrl(this.pool, this.picturePool);
        this.fullUpdate();
      }
    }); 
    this.debouncedUpdate$.pipe(
      takeUntilDestroyed(this.destroyRef),
      debounceTime(500),
    ).subscribe(()=>{
      this.fullUpdate();
      window.console.log('Debounced update');
    })
  }

  async tabChanged(data: {index:number}): Promise<void> {
    if (this.pool && data && data.index !== undefined) {
      this.pool.mode = ScreenUtils.SCREEN_MODE_TABLE[data.index];
      await this.fullUpdate();
    }
  }

  async initiateFullUpdate(): Promise<void> {
    this.fullUpdateReady = true;
    return this.fullUpdate();
  }

  async fullUpdate(): Promise<void> {
    if (!this.pool || !this.fullUpdateReady) {
      return;
    }
    window.console.log("full update", this.pool);
    ScreenUtils.recalculateHtml(this.pool);
    await ScreenUtils.recalculateFile(this.pool);
  }

  async save(): Promise<void> {
    window.console.log('save', this.pool);
    if (!this.pool || !this.pool.name) {
      if (this.pool) {
        this.screenService.api.showErrorMessage("navn må angis");
      }
      return;
    }
    let body = this.pool;
    const api$ = this.pool.id ? this.screenService.put(body) : this.screenService.post(body);
    api$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(()=>{
      this.router.navigate(["/screen"], { relativeTo: this.route });
    });
  }

  addTextBlock(): void {
    if (!this.pool) {
      return;
    }
    if (!this.pool.text) {
      this.pool.text = [];
    }
    this.pool.text.push({
      message: "",
      color: "#ffffff",
      fontSize: "60",
      gap: "80",
    });
  }

  modelChange(v: any): void {
    this.debouncedUpdate$.next(null);
  }
}
