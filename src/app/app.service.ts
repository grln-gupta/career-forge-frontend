import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000'; 

  constructor(private http: HttpClient) {}

  optimize(text: string, mode: string, role: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/optimize`, {
      text: text,
      mode: mode,       
      target_role: role 
    });
  }
}