import { Component, OnDestroy, OnInit } from '@angular/core';
import { Group } from '../../model/group';
import { AppLoaderComponent } from '../../components/loader/loader.component';
import { PageMessageComponent } from '../../components/page-message/page-message.component';
import { GroupService } from '../../services/group.service';
import { Subscription } from 'rxjs';
import { AddButtonComponent } from '../../components/add-button/add-button.component';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [AppLoaderComponent, PageMessageComponent, AddButtonComponent],
  templateUrl: './app-group.component.html',
  styleUrl: './app-group.component.less'
})
export class AppGroupComponent implements OnInit, OnDestroy{
  designTime: boolean = false;
  pool: Group[] | undefined = this.designTime ? [
     {
         id: "378973287932",
         name: "Gruppe at the central plant",
     },
     {
      id: "3784908934",
      name: "Gruppe at the bottom side",
     },
  

  ] : undefined;

  unsubscribeQuery!: Subscription;

  constructor(private groupService: GroupService) {

  }

  ngOnDestroy(): void {
    this.unsubscribeQuery && this.unsubscribeQuery.unsubscribe();
  }

  ngOnInit(): void {
    if (!this.designTime) {
      this.unsubscribeQuery = this.groupService.getAll().subscribe((pool)=>{
        this.pool = pool.pool;
      });
    }
  }
  
}
