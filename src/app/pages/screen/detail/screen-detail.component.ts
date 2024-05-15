import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Media } from '../../../model/media';

@Component({
  selector: 'app-screen-detail',
  standalone: true,
  imports: [
    MatTabsModule,
    MatListModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule, 
  ],
  templateUrl: './screen-detail.component.html',
  styleUrl: './screen-detail.component.less'
})
export class ScreenDetailComponent {
    
  videoPool: Media[] = [
    {
      id: "234",
      name: "Music Life"
    }
  ];
  picturePool: Media[] = [
    {
      id: "1234",
      name: "Stavanger"
    },
    {
      id: "2234",
      name: "Production Workshop"
    },
  ];

  save(): void {

  }

  undo(): void {

  }
}
