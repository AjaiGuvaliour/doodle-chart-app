import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  baseUrl: any = 'http://localhost:3000';
  private header: any;
  constructor(
    private http: HttpClient,
    private loader: LoaderService
  ) { }

  private setContentType() {
    this.header = {
      'content-type': 'application/json',
    }
  }
  private setAuthToken() {
    const token: string = localStorage.getItem('token');
    if (token) {
      this.header['token'] = token;
    }
  }

  private get headers(): any {
    this.setContentType();
    this.setAuthToken();
    return this.header;
  }

  public get(relativeUrl: string): Observable<any> {
    return this.http.get(this.baseUrl + relativeUrl, { headers: new HttpHeaders(this.headers) }).pipe(
      catchError(this.handleError)
    )
  }

  public post(relativeUrl: string, data: any) {
    return this.http.post(this.baseUrl + relativeUrl, data,
      { headers: new HttpHeaders(this.headers) }).pipe(
        catchError(this.handleError)
      );
  }

  private handleError = (error: any) => {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    this.loader.hide();
    return throwError(errorMessage);
  }
}
