import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'save-footer',
  standalone: true,
  templateUrl: './save-footer.component.html',
  styleUrl: './save-footer.component.less',
  imports: [MatButtonModule, MatDividerModule, MatIconModule]
})
export class SaveFooterComponent {
     @Input() message: string = "Lagre";
     @Input() cancelRoute!: string;
     @Output() save: EventEmitter<void> = new EventEmitter();

     constructor(
      private route: ActivatedRoute,
      private router: Router, 
    ) {
  
    }

     undo(): void {
      this.router.navigate([this.cancelRoute], { relativeTo: this.route });
     } 
}
