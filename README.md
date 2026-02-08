# 🚀 Career Forge AI - Frontend

The client-side interface for **Career Forge**, a Full-Stack AI application designed to help developers engineer superior career assets. Built with **Angular 19**, this project emphasizes modern frontend architecture, clean UI/UX, and reactive integration with a Python AI backend.

![Application Screenshot](https://github.com/grln-gupta/career-forge-frontend/blob/main/src/dashboard-preview.png)

## 🎨 UI & UX Design

* **Dashboard Layout:** A professional "Dark Mode" interface inspired by IDEs (VS Code) to appeal to developer users.
* **Split-Screen Workflow:** Real-time Input (Left) vs. AI Output (Right) for immediate feedback loops.
* **Responsive Design:** Fully fluid CSS Grid layout that adapts to mobile and desktop viewports.
* **Asset Management:** Custom SVG Iconography (Logo, Favicon) embedded directly for performance.

## 🏗 Technical Highlights

* **Angular 19 Standalone Components:** Utilizing the latest Angular features to reduce boilerplate and remove `NgModule`.
* **Reactive State:** Simple, effective local state management for handling asynchronous API loading states (`isLoading`, `errorMessage`).
* **Service-Repository Pattern:** All HTTP logic isolated in `ApiService` for separation of concerns and testability.
* **Utility Features:**
    * **Clipboard Integration:** One-click copy functionality.
    * **File Export:** Browser-based `.txt` file generation (Blob API).
    * **Auto-Wake:** "Silent Ping" logic to warm up the backend server upon application initialization.

## 🛠 Tech Stack

* **Framework:** Angular 19 (CLI)
* **Language:** TypeScript 5+
* **Styling:** CSS3 (Grid, Flexbox, Custom Variables)
* **HTTP Client:** Angular `HttpClient`
* **Deployment:** Vercel / Netlify

## 🔧 Local Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/career-forge-web.git](https://github.com/YOUR_USERNAME/career-forge-web.git)
    cd career-forge-web
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Run Development Server:**
    ```bash
    ng serve
    ```
    Navigate to `http://localhost:4200/`.

## 🔄 Integration

This frontend consumes the **Career Forge API**. Ensure the backend is running locally or update `api.service.ts` to point to your live Render URL.

```typescript
// src/app/api.service.ts
private apiUrl = '[https://your-backend-url.onrender.com/optimize](https://your-backend-url.onrender.com/optimize)';
