import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PresentationService } from '../../../services/presentation.service';
import { Subscription } from 'rxjs';
import { Presentation } from '../../../model/presentation';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'presentation-activate',
  standalone: true,
  imports: [MatIconModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatButtonModule ],
  templateUrl: './presentation-activate.component.html',
  styleUrl: './presentation-activate.component.less'
})
export class PresentationActivateComponent implements OnInit, OnDestroy {
  root: string = '';
  response: any;
  unsubscribeQuery!: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public pool: Presentation,  
               private presentationService: PresentationService) {
  	this.root = presentationService.getRoot();
  }

  ngOnDestroy(): void {
    this.unsubscribeQuery && this.unsubscribeQuery.unsubscribe();  
  }

  ngOnInit(): void {
    if (!this.pool || !this.pool.id) {
      return;
    }
    const api$ =  this.presentationService.activate(this.pool.id);
    this.unsubscribeQuery = api$.subscribe((res) => {
      this.response = res || {error:"Serverfeil"};
      window.console.log("finished activation");
    });

  }

}
