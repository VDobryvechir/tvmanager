import { Component, Input } from '@angular/core';
import { Screen } from '../../../model/screen';

@Component({
  selector: 'app-screen-view',
  standalone: true,
  imports: [],
  templateUrl: './screen-view.component.html',
  styleUrl: './screen-view.component.less'
})
export class ScreenViewComponent {
    @Input() id: string | undefined;
    @Input() name: string | undefined;
    @Input() mode: string | undefined;
    @Input() file: string | undefined;

}
