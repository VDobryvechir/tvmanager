import { Component, OnDestroy, OnInit } from '@angular/core';
import { Task } from '../../model/task';
import { AppLoaderComponent } from '../../components/loader/loader.component';
import { PageMessageComponent } from '../../components/page-message/page-message.component';
import { TaskService } from '../../services/task.service';
import { Subscription } from 'rxjs';
import { AddButtonComponent } from '../../components/add-button/add-button.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AppLoaderComponent, PageMessageComponent, AddButtonComponent],
  templateUrl: './app-home.component.html',
  styleUrl: './app-home.component.less'
})
export class AppHomeComponent implements OnInit, OnDestroy{
  designTime: boolean = false;
  pool: Task[] | undefined = this.designTime ? [
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

  constructor(private taskService: TaskService) {

  }

  ngOnDestroy(): void {
    this.unsubscribeQuery && this.unsubscribeQuery.unsubscribe();
  }

  ngOnInit(): void {
    if (!this.designTime) {
      this.unsubscribeQuery = this.taskService.getAll().subscribe((pool)=>{
        this.pool = pool;
      });
    }
  }
  
}
