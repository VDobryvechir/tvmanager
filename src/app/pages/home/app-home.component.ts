import { Component, OnDestroy, OnInit } from '@angular/core';
import { Task } from '../../model/task';
import { AppLoaderComponent } from '../../components/loader/loader.component';
import { PageMessageComponent } from '../../components/page-message/page-message.component';
import { TaskService } from '../../services/task.service';
import { Subscription } from 'rxjs';
import { AddButtonComponent } from '../../components/add-button/add-button.component';
import { AppHomeViewComponent } from './view/app-home-view.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AppLoaderComponent, PageMessageComponent, AddButtonComponent,AppHomeViewComponent,ButtonModule],
  templateUrl: './app-home.component.html',
  styleUrl: './app-home.component.less'
})
export class AppHomeComponent implements OnInit, OnDestroy{
  pool: Task[] | undefined;

  unsubscribeQuery!: Subscription;

  constructor(private taskService: TaskService) {

  }

  ngOnDestroy(): void {
    this.unsubscribeQuery && this.unsubscribeQuery.unsubscribe();
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.unsubscribeQuery && this.unsubscribeQuery.unsubscribe();
    this.unsubscribeQuery = this.taskService.getAll().subscribe((pool)=>{
      this.pool = pool;
    });
  }
  
}
