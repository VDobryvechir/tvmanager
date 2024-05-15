import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-button',
  standalone: true,
  templateUrl: './add-button.component.html',
  styleUrl: './add-button.component.less'
})
export class AddButtonComponent {
     @Input() message!: string;

     @Input() routing!: string;

    constructor(private route: ActivatedRoute,
                private router: Router 
    ) {
  
    }

    addRoute(): void {
      this.router.navigate([this.routing], { relativeTo: this.route });
    }
}
