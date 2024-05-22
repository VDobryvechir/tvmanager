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
  destroyRef = inject(DestroyRef);
  
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
    });
    this.video.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(()=>{
      if (this.video.value && this.pool) {
        this.pool.video = this.video.value;
        ScreenUtils.adjustVideoUrl(this.pool, this.videoPool);
      }
    }); 
  }

  async tabChanged(data: {index:number}): Promise<void> {
    if (this.pool && data && data.index !== undefined) {
      this.pool.mode = ScreenUtils.SCREEN_MODE_TABLE[data.index];
      ScreenUtils.recalculateHtml(this.pool);
      await ScreenUtils.recalculateFile(this.pool);
    }
  }

  async save(): Promise<void> {
    window.console.log('save', this.pool);
    if (!this.pool || !this.pool.name) {
      return;
    }
    ScreenUtils.recalculateHtml(this.pool);
    await ScreenUtils.recalculateFile(this.pool);
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
    });
  }
}
