import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable, catchError } from 'rxjs';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  serverAddress: string = "http://localhost:80";
  show: (err: HttpErrorResponse) => Observable<any>;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds = 10;

  constructor(protected httpClient: HttpClient,
    public snackBar: MatSnackBar,
  ) {
      if (!window.location.origin.includes(":4200")) {
           this.serverAddress = "";
      }   
      this.show = this.showError.bind(this);     
  }

  showError(error: HttpErrorResponse): Observable<any> {
    let message = "Systemfeil";
    if (error.status) {
      message = "Feil " + error.status + " " + error.statusText;
    } else if (error.error?.message) {
      message = "Feil " + error.error.message;
    } else if (error.message) {
      message = "Feil " + error.message;
    }
    this.showErrorMessage(message);
    return EMPTY;
  }

  showErrorMessage(message: string): void {
    this.snackBar.open(message, "Lukke", {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
    });
  }

  getRootUrl(): string {
    return this.serverAddress;
  }

  finishUrl(url: string): string {
    return this.serverAddress + url; 
  }

  get(url: string): Observable<any> {
    url = this.finishUrl(url);
    return this.httpClient.get(url).pipe(catchError(this.show));
  }

  post(url: string, data: any): Observable<any> {
    url = this.finishUrl(url);
    return this.httpClient.post(url, data).pipe(catchError(this.show));
  }

  put(url: string, data: any): Observable<any> {
    url = this.finishUrl(url);
    return this.httpClient.put(url, data).pipe(catchError(this.show));
  }

  delete(url: string): Observable<any> {
    url = this.finishUrl(url);
    return this.httpClient.delete(url).pipe(catchError(this.show));
  }

}
