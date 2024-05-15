import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-message',
  standalone: true,
  templateUrl: './page-message.component.html',
  styleUrl: './page-message.component.less'
})
export class PageMessageComponent {
     @Input() message: string[] = [];
}
