import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PickedWord } from 'src/app/shared/models/PickedWord.model';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  data: Observable<PickedWord[]> | undefined;
  constructor(private http: HttpClient) { }


  /**
* This is the getWordList function
* Api Call to get the wordList
* @param url This is the api parameter url
* @returns returns data as Observable Array of PickedWord
*/
  public getWordList(url: string): Observable<Array<PickedWord>> {
    // Call the http GET
    this.data = this.http.get<Array<PickedWord>>(url)
    catchError((err) => {
      console.log('error caught in service')
      console.error(err);
      //Handle the error here
      return throwError(err);    //Rethrow it back to component
    })
    return this.data;
  }
}
