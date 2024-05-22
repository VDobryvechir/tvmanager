import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScreenService } from '../../services/screen.service';
import { Subscription } from 'rxjs';
import { Screen } from '../../model/screen';
import { AppLoaderComponent } from '../../components/loader/loader.component';
import { PageMessageComponent } from '../../components/page-message/page-message.component';
import { ScreenViewComponent } from './view/screen-view.component';
import { AddButtonComponent } from '../../components/add-button/add-button.component';

@Component({
  selector: 'app-screen',
  standalone: true,
  imports: [AppLoaderComponent, 
            PageMessageComponent, 
            ScreenViewComponent,
            AddButtonComponent
          ],
  templateUrl: './app-screen.component.html',
  styleUrl: './app-screen.component.less'
})
export class AppScreenComponent implements OnInit, OnDestroy {
  pool: Screen[] | undefined;
  unsubscribeScreens!: Subscription;
  root: string;

  constructor(private screenService: ScreenService) {
    this.root = this.screenService.getRoot();
  }

  ngOnDestroy(): void {
    this.unsubscribeScreens && this.unsubscribeScreens.unsubscribe();
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.unsubscribeScreens && this.unsubscribeScreens.unsubscribe();
    this.unsubscribeScreens = this.screenService.getAll().subscribe((pool)=>{
       this.pool = pool;
    });
  }
}
