import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './app.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  // 1. Data Models
  inputText: string = '';
  selectedMode: string = 'resume'; // Default
  targetRole: string = 'Senior Developer'; // Default
  
  optimizedResult: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private apiService: ApiService) {}

  // 2. The Main Function
  runOptimization() {
    // Validation: Don't run if empty
    if (!this.inputText.trim()) {
      this.errorMessage = 'Please enter some text to optimize.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.optimizedResult = '';

    // --- CRITICAL FIX IS HERE ---
    // We create a specific object that matches the Python Backend exactly.
    const payload = {
      text: this.inputText,   // Python expects "text"
      mode: this.selectedMode, // Python expects "mode"
      role: this.targetRole    // Python expects "role"
    };

    console.log('Sending to Backend:', payload); // Debugging

    // 3. Send to API
    this.apiService.optimizeContent(payload).subscribe({
      next: (response: any) => {
        console.log('Success:', response);
        this.optimizedResult = response.optimized; // Show result
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error:', error);
        this.errorMessage = 'Connection failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  // Helper for UI Button Text
  getButtonText(): string {
    if (this.isLoading) return 'Optimizing...';
    switch (this.selectedMode) {
      case 'resume': return 'Rewrite for Resume';
      case 'linkedin': return 'Generate LinkedIn Post';
      default: return 'Optimize Text';
    }
  }
}