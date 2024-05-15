import { Component, OnDestroy, OnInit } from '@angular/core';
import { Tvpc } from '../../model/tvpc';
import { AppLoaderComponent } from '../../components/loader/loader.component';
import { PageMessageComponent } from '../../components/page-message/page-message.component';
import { TvpcService } from '../../services/tvpc.service';
import { Subscription } from 'rxjs';
import { AddButtonComponent } from '../../components/add-button/add-button.component';

@Component({
  selector: 'app-tvpc',
  standalone: true,
  imports: [AppLoaderComponent, PageMessageComponent, AddButtonComponent],
  templateUrl: './app-tvpc.component.html',
  styleUrl: './app-tvpc.component.less'
})
export class AppTvpcComponent implements OnInit, OnDestroy {
    designTime: boolean = false;
    pool: Tvpc[] | undefined = this.designTime ? [
       {
           id: "378973287932",
           name: "Computer at the central plant",
           url: "DVDOBR\\KaloApoevma"
       },
       {
        id: "3784908934",
        name: "Computer at the bottom side",
        url: "DVDOBR\\Danyil"
       },
    

    ] : undefined;

    unsubscribeQuery!: Subscription;

    constructor(private tvpcService: TvpcService) {

    }

    ngOnDestroy(): void {
      this.unsubscribeQuery && this.unsubscribeQuery.unsubscribe();
    }

    ngOnInit(): void {
      if (!this.designTime) {
        this.unsubscribeQuery = this.tvpcService.getAll().subscribe((pool)=>{
          this.pool = pool;
        });
      }
    }
}
