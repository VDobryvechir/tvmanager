import { Component } from '@angular/core';
import { Tvpc } from '../../model/tvpc';
import { AppLoaderComponent } from '../../components/loader/loader.component';

@Component({
  selector: 'app-tvpc',
  standalone: true,
  imports: [AppLoaderComponent],
  templateUrl: './app-tvpc.component.html',
  styleUrl: './app-tvpc.component.less'
})
export class AppTvpcComponent {
    pool: Tvpc[] | undefined = [
       {
           id: "378973287932",
           name: "Computer at the central plant",
           url: "DVDOBR\\KaloApoevma"
       },
       {
        id: "3784908934",
        name: "Computer at the bottom side",
        url: "DVDOBR\\Danyil"
       },
    

    ];


}
