import { Component, OnDestroy, OnInit } from '@angular/core';
import { Tvpc } from '../../model/tvpc';
import { AppLoaderComponent } from '../../components/loader/loader.component';
import { PageMessageComponent } from '../../components/page-message/page-message.component';
import { TvpcService } from '../../services/tvpc.service';
import { Subscription } from 'rxjs';
import { AddButtonComponent } from '../../components/add-button/add-button.component';
import { TvpcViewComponent } from './view/tvpc-view.component';

@Component({
  selector: 'app-tvpc',
  standalone: true,
  imports: [AppLoaderComponent, PageMessageComponent, AddButtonComponent, TvpcViewComponent],
  templateUrl: './app-tvpc.component.html',
  styleUrl: './app-tvpc.component.less'
})
export class AppTvpcComponent implements OnInit, OnDestroy {
    pool: Tvpc[] | undefined;

    unsubscribeQuery!: Subscription;

    constructor(private tvpcService: TvpcService) {

    }

    ngOnDestroy(): void {
      this.unsubscribeQuery && this.unsubscribeQuery.unsubscribe();
    }

    ngOnInit(): void {
      this.refresh()
    }

    refresh(): void {
      this.unsubscribeQuery && this.unsubscribeQuery.unsubscribe();
      this.unsubscribeQuery = this.tvpcService.getAll().subscribe((pool)=>{
        this.pool = pool;
      });
  }

}
