import { Component, Input, Output, EventEmitter, booleanAttribute } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.less',
  imports: [MatIconModule],
})
export class FileUploaderComponent {
     @Input() message!: string;
     @Input() kind: string = "picture";
     @Output() update: EventEmitter<File> = new EventEmitter();
     fileName: string = "";
      
     onFileSelected(event: any): void {
      const file:File = event.target.files[0];
      if (file) {
          this.fileName = file.name;
          this.update.emit(file);
      }
     }
}
