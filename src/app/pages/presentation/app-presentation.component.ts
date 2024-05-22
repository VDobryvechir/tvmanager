import { Component, OnDestroy, OnInit } from '@angular/core';
import { Presentation } from '../../model/presentation';
import { AppLoaderComponent } from '../../components/loader/loader.component';
import { PageMessageComponent } from '../../components/page-message/page-message.component';
import { PresentationService } from '../../services/presentation.service';
import { Subscription } from 'rxjs';
import { AddButtonComponent } from '../../components/add-button/add-button.component';
import { PresentationViewComponent } from './view/presentation-view.component';

@Component({
  selector: 'app-presentation',
  standalone: true,
  imports: [AppLoaderComponent, PageMessageComponent, AddButtonComponent, PresentationViewComponent],
  templateUrl: './app-presentation.component.html',
  styleUrl: './app-presentation.component.less'
})
export class AppPresentationComponent implements OnInit, OnDestroy {
    designTime: boolean = false;
    pool: Presentation[] | undefined;

    unsubscribeQuery!: Subscription;

    constructor(private presentationService: PresentationService) {

    }

    ngOnDestroy(): void {
      this.unsubscribeQuery && this.unsubscribeQuery.unsubscribe();
    }

    ngOnInit(): void {
      this.refresh();
    }

    refresh(): void {
      this.unsubscribeQuery && this.unsubscribeQuery.unsubscribe();
      this.unsubscribeQuery = this.presentationService.getAllTransformed().subscribe((pool)=>{
        this.pool = pool;
      });
  }
 
}
