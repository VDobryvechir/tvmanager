import { Component, OnDestroy, OnInit } from '@angular/core';
import { Group } from '../../model/group';
import { AppLoaderComponent } from '../../components/loader/loader.component';
import { PageMessageComponent } from '../../components/page-message/page-message.component';
import { GroupService } from '../../services/group.service';
import { Subscription } from 'rxjs';
import { AddButtonComponent } from '../../components/add-button/add-button.component';
import { GroupViewComponent } from './view/group-view.component';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [AppLoaderComponent, PageMessageComponent, AddButtonComponent, GroupViewComponent],
  templateUrl: './app-group.component.html',
  styleUrl: './app-group.component.less'
})
export class AppGroupComponent implements OnInit, OnDestroy {
    pool: Group[] | undefined;

    unsubscribeQuery!: Subscription;

    constructor(private groupService: GroupService) {

    }

    ngOnDestroy(): void {
      this.unsubscribeQuery && this.unsubscribeQuery.unsubscribe();
    }

    ngOnInit(): void {
      this.refresh();
    }

    refresh(): void {
      this.unsubscribeQuery && this.unsubscribeQuery.unsubscribe();
      this.unsubscribeQuery = this.groupService.getAllTransformed().subscribe((pool)=>{
        this.pool = pool;
      });
  }

}
