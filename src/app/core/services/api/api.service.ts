import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PickedWord } from 'src/app/shared/models/PickedWord.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  data: any;

  constructor(private http: HttpClient) { }

  public getwordList(url: string): Observable<Array<PickedWord>> {
    // Call the http GET
    this.data =  this.http.get<Array<PickedWord>>(url)
      // .pipe(shareReplay(1))
      // .pipe(refCount()).pipe(
        catchError((err) => {
          console.log('error caught in service')
          console.error(err);
          //Handle the error here
          return throwError(err);    //Rethrow it back to component
        })
return this.data;
 
  // }
  }
}
