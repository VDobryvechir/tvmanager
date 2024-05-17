import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppButtonComponent } from './components/button/button.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  home = 'home';
  presentation = 'presentation';
  screen = 'screen';
  video = 'video';
  picture = 'picture';
  group = 'group';
  tvpc = 'tvpc';
  active = this.home;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
  ) {

  }

  menuSelect(name: string) {
    this.active = name;
    this.router.navigate([name], { relativeTo: this.route });
  }  
}
