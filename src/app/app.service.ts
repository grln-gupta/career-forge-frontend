import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Live Backend URL
  private apiUrl = 'https://career-forge-backend-j7lq.onrender.com/optimize';

  constructor(private http: HttpClient) { }

  optimizeText(text: string, mode: string, targetRole: string): Observable<any> {
    
    // THE FIX: Changed 'target_role' to 'role'
    const payload = {
      text: text,
      mode: mode,
      role: targetRole
    };

    return this.http.post<any>(this.apiUrl, payload);
  }
}