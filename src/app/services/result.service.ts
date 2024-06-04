import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  private apiUrl = 'http://127.0.0.1:8000/api/result'; // Adjust the endpoint as necessary

  constructor(private http: HttpClient) { }
  getResultName(resultId: number): Observable<string> {
    return this.http.get<{ name: string }>(`${this.apiUrl}/${resultId}`).pipe(
      map(response => response.name)
    );
  }
  
}
