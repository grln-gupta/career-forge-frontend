import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Your live Render Backend URL
  private apiUrl = 'https://career-forge-backend-j7lq.onrender.com/optimize';

  constructor(private http: HttpClient) { }

  // ✅ THIS IS THE METHOD THAT WAS MISSING
  optimizeContent(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}