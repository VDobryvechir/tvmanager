import { Component, OnDestroy, OnInit } from '@angular/core';
import { Task } from '../../model/task';
import { AppLoaderComponent } from '../../components/loader/loader.component';
import { PageMessageComponent } from '../../components/page-message/page-message.component';
import { TaskService } from '../../services/task.service';
import { Subscription } from 'rxjs';
import { AddButtonComponent } from '../../components/add-button/add-button.component';
import { AppHomeViewComponent } from './view/app-home-view.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AppLoaderComponent, PageMessageComponent, AddButtonComponent,AppHomeViewComponent],
  templateUrl: './app-home.component.html',
  styleUrl: './app-home.component.less'
})
export class AppHomeComponent implements OnInit, OnDestroy{
  designTime: boolean = true;
  pool: Task[] | undefined = this.designTime ? [
     {
         id: "378973287932",
         name: "Gruppe at the central plant",
         url: "TSK2016004",
         oldPresentationName: "two people on the sea",
         oldPresentationVersion: "123",
         oldPresentationId: "87987676876",
         newPresentationId: "434587687678",
         newPresentationName: "to mennesker på sjøen",
         newPresentationVersion: "5464980",
         config: {
          file: ["what"],
          duration: [10],
         },
         taskStatus: 900,
         connectionStatus: -1,
         leftFiles: ["v897"],
         realFiles: ["46546"],
     },
     {
      id: "3784908934",
      name: "Gruppe at the bottom side",
      url: "TSK2016004",
      oldPresentationName: "two people on the sea",
      oldPresentationVersion: "5464980",
      oldPresentationId: "434587687678",
      newPresentationId: "434587687678",
      newPresentationName: "to mennesker på sjøen",
      newPresentationVersion: "5464980",
      config: {
       file: ["what"],
       duration: [10],
      },
      taskStatus: 1000,
      connectionStatus: 0,
      leftFiles: ["v897"],
      realFiles: ["46546"],
  },
  

  ] : undefined;

  unsubscribeQuery!: Subscription;

  constructor(private taskService: TaskService) {

  }

  ngOnDestroy(): void {
    this.unsubscribeQuery && this.unsubscribeQuery.unsubscribe();
  }

  ngOnInit(): void {
    if (!this.designTime) {
      this.refresh();
    }
  }

  refresh(): void {
    this.unsubscribeQuery && this.unsubscribeQuery.unsubscribe();
    this.unsubscribeQuery = this.taskService.getAll().subscribe((pool)=>{
      this.pool = pool;
    });
  }
  
}
