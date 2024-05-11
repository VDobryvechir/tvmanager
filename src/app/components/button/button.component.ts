import { Component, Input, Output, EventEmitter, booleanAttribute } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.less'
})
export class AppButtonComponent {
     @Input() message!: string;

     @Input({transform: booleanAttribute}) showUpIcon: boolean = false;

     @Input() name!: string;

     @Input() active!: string;

     @Output() select = new EventEmitter<string>();
}
