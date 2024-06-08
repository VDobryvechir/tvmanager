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
  pages = ['home', 'presentation', 'screens', 'videos', 'pictures', 'group', 'tvpc']
  active = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
  ) {
    this.active = this.findPage(this.pages, window.location.pathname)
  }

  findPage(lst: string[], path: string): string {
    if (!path || path[0]!=='/') {
      return lst[0];
    }
    path = path.substring(1);
    for(let i=0;i<lst.length;i++) {
      if (path.startsWith(lst[i])) {
        return lst[i];
      }
    }
    return lst[0];
  }

  menuSelect(name: string) {
    this.active = name;
    this.router.navigate([name], { relativeTo: this.route });
  }  
}
