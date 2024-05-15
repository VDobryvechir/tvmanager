import { Component, OnDestroy, OnInit } from '@angular/core';
import { Presentation } from '../../model/presentation';
import { AppLoaderComponent } from '../../components/loader/loader.component';
import { PageMessageComponent } from '../../components/page-message/page-message.component';
import { PresentationService } from '../../services/presentation.service';
import { Subscription } from 'rxjs';
import { AddButtonComponent } from '../../components/add-button/add-button.component';

@Component({
  selector: 'app-presentation',
  standalone: true,
  imports: [AppLoaderComponent, PageMessageComponent, AddButtonComponent],
  templateUrl: './app-presentation.component.html',
  styleUrl: './app-presentation.component.less'
})
export class AppPresentationComponent implements OnInit, OnDestroy {
    designTime: boolean = false;
    pool: Presentation[] | undefined = this.designTime ? [
       {
           id: "378973287932",
           name: "Computer at the central plant",
           version: "DVDOBR\\KaloApoevma"
       },
       {
        id: "3784908934",
        name: "Computer at the bottom side",
        version: "DVDOBR\\Danyil"
       },
    

    ] : undefined;

    unsubscribeQuery!: Subscription;

    constructor(private presentationService: PresentationService) {

    }

    ngOnDestroy(): void {
      this.unsubscribeQuery && this.unsubscribeQuery.unsubscribe();
    }

    ngOnInit(): void {
      if (!this.designTime) {
        this.unsubscribeQuery = this.presentationService.getAll().subscribe((pool)=>{
          this.pool = pool;
        });
      }
    }
}
