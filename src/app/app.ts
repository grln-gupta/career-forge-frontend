import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import { ApiService } from './app.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="app-container">
      
      <aside class="sidebar">
        <div class="brand">
          <span class="icon">⚡</span> CareerForge<span class="ai">.ai</span>
        </div>
        <nav>
          <button (click)="switchTab('resume')" [class.active]="activeTab === 'resume'">
            📄 Resume ATS Fixer
          </button>
          <button (click)="switchTab('linkedin')" [class.active]="activeTab === 'linkedin'">
            💼 LinkedIn Viral Post
          </button>
          <button (click)="switchTab('portfolio')" [class.active]="activeTab === 'portfolio'">
            🎨 Case Study Builder
          </button>
        </nav>
        <div class="footer">v1.2.0 • Speed Optimized</div>
      </aside>

      <main class="main-content">
        
        <header>
          <h1>{{ getHeaderTitle() }}</h1>
          <p>{{ getHeaderSubtitle() }}</p>
        </header>

        <div class="workspace">
          
          <div class="panel input-panel">
            
            <div class="form-group">
              <label>Target Role / Profession <span class="required">*</span></label>
              <input 
                [(ngModel)]="targetRole" 
                [class.error-border]="showErrors && !targetRole"
                placeholder="e.g. Senior Accountant, Nurse, Java Developer">
              <span *ngIf="showErrors && !targetRole" class="error-text">⚠️ Role is required to customize the AI.</span>
            </div>

            <div class="form-group">
              <label>Your Draft / Raw Notes <span class="required">*</span></label>
              <textarea 
                [(ngModel)]="inputText" 
                [class.error-border]="showErrors && !inputText"
                placeholder="Paste your rough bullet points or thoughts here..."></textarea>
              <span *ngIf="showErrors && !inputText" class="error-text">⚠️ Please enter some text to optimize.</span>
            </div>

            <button class="primary-btn" (click)="runOptimization()" [disabled]="isLoading">
              <span *ngIf="isLoading" class="loader"></span>
              {{ isLoading ? loadingMessage : getButtonText() }}
            </button>
          </div>

          <div class="panel output-panel">
            <div class="output-header">
              <label>AI Optimized Result</label>
              <div class="actions" *ngIf="result">
                <button (click)="copyToClipboard()" class="icon-btn" title="Copy Text">📋 Copy</button>
                <button (click)="downloadPDF()" class="icon-btn" title="Download PDF">📥 PDF</button>
              </div>
            </div>

            <div class="result-box" [class.placeholder]="!result">
              {{ result || 'Your optimized content will appear here...' }}
            </div>
          </div>

        </div>
      </main>
    </div>
  `,
  styles: [`
    /* GLOBAL LAYOUT */
    :host { font-family: 'Inter', sans-serif; display: flex; height: 100vh; background: #0f172a; color: #f8fafc; overflow: hidden; }
    .app-container { display: flex; width: 100%; }
    
    /* SIDEBAR */
    .sidebar { width: 260px; background: #1e293b; padding: 30px 20px; display: flex; flex-direction: column; border-right: 1px solid #334155; }
    .brand { font-size: 24px; font-weight: 800; color: white; margin-bottom: 40px; display: flex; align-items: center; gap: 10px; }
    .brand .ai { color: #38bdf8; }
    .footer { margin-top: auto; font-size: 12px; color: #64748b; text-align: center; }
    
    nav button { background: transparent; border: none; color: #94a3b8; padding: 14px; text-align: left; cursor: pointer; font-size: 15px; border-radius: 8px; margin-bottom: 8px; width: 100%; transition: all 0.2s; font-weight: 500; }
    nav button:hover { background: #334155; color: white; }
    nav button.active { background: #38bdf8; color: #0f172a; font-weight: 700; }

    /* MAIN AREA */
    .main-content { flex: 1; padding: 40px 60px; display: flex; flex-direction: column; overflow-y: auto; }
    header { margin-bottom: 30px; }
    h1 { margin: 0; font-size: 28px; font-weight: 700; color: white; }
    p { margin: 5px 0 0; color: #94a3b8; font-size: 14px; }

    .workspace { display: flex; gap: 40px; flex: 1; min-height: 0; }
    .panel { flex: 1; display: flex; flex-direction: column; gap: 20px; min-width: 0; }

    /* FORMS */
    .form-group { display: flex; flex-direction: column; gap: 8px; }
    label { font-size: 12px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px; }
    .required { color: #f43f5e; }
    
    input, textarea { background: #1e293b; border: 1px solid #334155; color: white; padding: 16px; border-radius: 8px; font-size: 14px; outline: none; transition: 0.2s; width: 100%; box-sizing: border-box; font-family: 'Inter', sans-serif; }
    input:focus, textarea:focus { border-color: #38bdf8; box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2); }
    textarea { height: 200px; resize: none; line-height: 1.6; }
    
    /* ERRORS */
    .error-border { border-color: #f43f5e !important; }
    .error-text { color: #f43f5e; font-size: 12px; font-weight: 600; animation: fadeIn 0.3s; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

    /* BUTTONS */
    .primary-btn { background: #38bdf8; color: #0f172a; border: none; padding: 16px; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 10px; transition: 0.2s; font-size: 14px; text-transform: uppercase; margin-top: 10px; min-width: 160px; }
    .primary-btn:hover { background: #0ea5e9; transform: translateY(-1px); }
    .primary-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

    .output-header { display: flex; justify-content: space-between; align-items: center; }
    .icon-btn { background: #334155; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer; font-weight: 600; margin-left: 8px; transition: 0.2s; }
    .icon-btn:hover { background: #475569; }

    /* RESULT BOX */
    .result-box { background: #1e293b; padding: 25px; border-radius: 8px; border: 1px solid #334155; flex: 1; white-space: pre-wrap; overflow-y: auto; line-height: 1.7; color: #e2e8f0; font-family: 'JetBrains Mono', monospace; font-size: 13px; }
    .result-box.placeholder { color: #64748b; font-style: italic; display: flex; align-items: center; justify-content: center; border-style: dashed; }

    /* LOADER */
    .loader { width: 16px; height: 16px; border: 2px solid rgba(15, 23, 42, 0.2); border-radius: 50%; border-top-color: #0f172a; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class App {
  activeTab = 'resume';
  targetRole = '';
  inputText = '';
  result = '';
  isLoading = false;
  showErrors = false;
  
  // NEW: Variables for the "Speedy" feel
  loadingMessage = 'Processing...';
  private loadingInterval: any;

  constructor(private api: ApiService) {}

  // --- DYNAMIC TEXT GETTERS ---
  getHeaderTitle() {
    if (this.activeTab === 'resume') return 'ATS Resume Optimizer';
    if (this.activeTab === 'linkedin') return 'LinkedIn Viral Post Creator';
    return 'Portfolio Case Study Builder';
  }

  getHeaderSubtitle() {
    if (this.activeTab === 'resume') return 'Turn weak bullet points into high-impact, metric-driven achievements.';
    if (this.activeTab === 'linkedin') return 'Draft engaging posts that stop the scroll and build authority.';
    return 'Structure your projects into professional STAR-method case studies.';
  }

  getButtonText() {
    if (this.activeTab === 'resume') return '⚡ Optimization Magic';
    if (this.activeTab === 'linkedin') return '🚀 Generate Post';
    return '🏗️ Build Case Study';
  }

  switchTab(tab: string) {
    this.activeTab = tab;
    this.result = ''; 
    this.showErrors = false;
    this.clearInterval(); // Safety clear
  }

  // --- MAIN LOGIC ---
  runOptimization() {
    this.showErrors = true;
    
    // Validation
    if (!this.targetRole.trim() || !this.inputText.trim()) {
      return; 
    }

    this.isLoading = true;
    this.result = ''; 
    
    // START PSYCHOLOGICAL LOADER
    const messages = [
      "🧠 Analyzing your input...",
      "🔍 Identifying key metrics...",
      "✨ Polishing grammar...",
      "🚀 optimizing for ATS...",
      "🔥 Finalizing output..."
    ];
    let i = 0;
    this.loadingMessage = messages[0];
    
    // Cycle through messages every 2 seconds to make it feel active
    this.loadingInterval = setInterval(() => {
      i = (i + 1) % messages.length;
      this.loadingMessage = messages[i];
    }, 2000);

    // Call API
    this.api.optimize(this.inputText, this.activeTab, this.targetRole).subscribe({
      next: (data: any) => {
        this.result = data.optimized;
        this.stopLoading();
      },
      error: (err: any) => {
        this.result = "⚠️ Server took too long or is waking up. Please try again in 10 seconds.";
        this.stopLoading();
      }
    });
  }

  // Helper to stop the loader safely
  private stopLoading() {
    this.isLoading = false;
    this.clearInterval();
  }

  private clearInterval() {
    if (this.loadingInterval) {
      clearInterval(this.loadingInterval);
      this.loadingInterval = null;
    }
  }

  // --- EXPORT TOOLS ---
  copyToClipboard() {
    navigator.clipboard.writeText(this.result).then(() => {
      alert('✅ Copied to clipboard!');
    });
  }

  downloadPDF() {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxLineWidth = pageWidth - (margin * 2);
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("CareerForge AI Output", margin, 20);
    
    // Sub-info
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text(`Role: ${this.targetRole} | Mode: ${this.activeTab.toUpperCase()}`, margin, 30);
    
    // Line Separator
    doc.setDrawColor(200);
    doc.line(margin, 35, pageWidth - margin, 35);

    // Body Content
    doc.setTextColor(0);
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(this.result, maxLineWidth);
    doc.text(splitText, margin, 45);
    
    doc.save(`CareerForge_${this.activeTab}_Optimized.pdf`);
  }
}