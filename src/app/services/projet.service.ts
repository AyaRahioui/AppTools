// project.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class ProjectService {
    private baseUrl = 'http://127.0.0.1:8000/api';
  
    constructor(private http: HttpClient) { }
  
    countProjectsByName(name: string): Observable<number> {
      return this.http.get<number>(`${this.baseUrl}/count/${name}`);}
  
    getProjectsByName(name: string): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/projects/${name}`);
    }
  }
  



  