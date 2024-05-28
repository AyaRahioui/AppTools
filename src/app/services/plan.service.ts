// plan.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private apiUrl = 'http://127.0.0.1:8000/api/plan';

  constructor(private http: HttpClient) { }

  getPlans(category: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?category=${category}`);
  }

  createPlan(plan: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, plan);
  }

  updatePlan(id: string, plan: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, plan);
  }

  deletePlan(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
