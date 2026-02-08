import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  // The Live Backend URL
  private apiUrl = 'https://career-forge-backend-j7lq.onrender.com/optimize'; 

  constructor(private http: HttpClient) { }

  // This is the function your component is looking for
  optimizeText(text: string, mode: string, targetRole: string): Observable<any> {
    
    // Create the payload (what we send to Python)
    const payload = {
      text: text,
      mode: mode,
      target_role: targetRole
    };

    // Send the POST request
    return this.http.post<any>(this.apiUrl, payload);
  }
}