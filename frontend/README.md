#  Knowledge-Base Search Engine (Frontend)

This is the **React-based user interface** for the local **Retrieval-Augmented Generation (RAG)** system.  
It provides a sleek, intuitive experience for uploading documents, ingesting text, and querying your customized knowledge base.

---

##  Features

- **Interactive Chat Interface**: Ask complex questions and receive AI-generated answers in real time  
- **Multi-Modal Uploads**: Upload PDFs or paste raw text with custom source names  
- **Source Citations**: Clear source "pills" showing which data the AI used  
- **Responsive Feedback**: Smooth loading states, transitions, and error handling  

---

##  Tech Stack

- **Framework**: React (with Vite for fast development)  
- **Styling**: Vanilla CSS (`App.css`, `index.css`)  
- **State Management**: React Hooks (`useState`, `useEffect`)  

---

##  Prerequisites

- Node.js (v16 or higher recommended)  
- npm (comes with Node.js)  
- Backend API (FastAPI server must be running)  

---

##  Setup Instructions

### 1️. Install Dependencies

```bash
npm install
```

---

### 2️. Start Development Server

```bash
npm run dev
```

---

### 3️. Open Application

Open your browser and go to:

```plaintext
http://localhost:5173
```

---

##  Connection Note

- This frontend connects to backend at:  
   http://127.0.0.1:8000  

- If you see errors like:
  - "Network Error"  
  - "Failed to fetch"  

 Make sure your **FastAPI backend is running** in another terminal  

---
