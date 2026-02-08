import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './app.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  // Data Models
  inputText: string = '';
  selectedMode: string = 'resume'; // <--- CHANGED TO RESUME
  targetRole: string = 'Senior Developer'; // <--- CHANGED TO GENERIC ROLE
  
  optimizedResult: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  copySuccess: boolean = false; 

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // It warms up the connection while the user is typing.
    console.log('⚡ Waking up Backend...');
    fetch('https://career-forge-backend-j7lq.onrender.com/docs')
      .then(() => console.log('✅ Backend is awake and ready!'))
      .catch(() => console.log('⚠️ Backend waking up...'));
  
  }
  // Sidebar Logic
  setMode(mode: string) {
    this.selectedMode = mode;
    this.optimizedResult = ''; 
    this.errorMessage = '';
    this.copySuccess = false;
  }

  // Dynamic Header
  getTitle(): string {
    switch(this.selectedMode) {
      case 'resume': return 'Resume ATS Fixer';
      case 'linkedin': return 'LinkedIn Viral Post';
      case 'portfolio': return 'Case Study Builder';
      default: return 'Career Forge';
    }
  }

  getSubtitle(): string {
    switch(this.selectedMode) {
      case 'resume': return 'Optimize your bullet points for high-frequency ATS keywords.';
      case 'linkedin': return 'Turn boring updates into viral, engaging professional stories.';
      case 'portfolio': return 'Structure your projects into professional STAR-method case studies.';
      default: return 'AI Optimization Tool';
    }
  }

  // API Call
  runOptimization() {
    if (!this.inputText.trim()) {
      this.errorMessage = 'Please enter some text first.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.copySuccess = false;

    const payload = {
      text: this.inputText,
      mode: this.selectedMode,
      role: this.targetRole
    };

    this.apiService.optimizeContent(payload).subscribe({
      next: (response: any) => {
        this.optimizedResult = response.optimized;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'AI service is busy. Please try again in a moment.';
        this.isLoading = false;
      }
    });
  }

  // Action Buttons
  copyToClipboard() {
    navigator.clipboard.writeText(this.optimizedResult).then(() => {
      this.copySuccess = true;
      setTimeout(() => this.copySuccess = false, 2000); 
    });
  }

  downloadContent() {
    const blob = new Blob([this.optimizedResult], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career-forge-${this.selectedMode}-${Date.now()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}