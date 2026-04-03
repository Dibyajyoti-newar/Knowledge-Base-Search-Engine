#  Knowledge-Base Search Engine

A full-stack **Retrieval-Augmented Generation (RAG)** platform that allows users to ingest PDFs and raw text into a local vector database, ask complex questions, and receive AI-synthesized answers backed by precise source citations.
<img width="1047" height="746" alt="Screenshot 2026-04-03 102436" src="https://github.com/user-attachments/assets/e4ddb859-78e0-4d64-ac08-b8091334c4ea" />
---

##  Demo Video


 [Watch the full application in action here](https://drive.google.com/file/d/1DyVJB8L91rOwAYnDbga1qv16XxM-xxnW/view?usp=sharing)

---

##  Project Overview

This project bridges the gap between **local data privacy** and **advanced LLM capabilities**.

By utilizing:
- **Local ChromaDB** → data stays on your machine  
- **HuggingFace embeddings** → open-source & efficient  
- **Google Gemini 2.5 Flash** → fast answer generation  

 The system generates **accurate answers strictly based on retrieved context**

---

##  Tech Stack

###  Frontend Interface

- React (Vite)  
- CSS (responsive & animated UI)  

###  Backend API

- FastAPI  
- LangChain  
- ChromaDB (local vector database)  
- HuggingFace (`all-MiniLM-L6-v2`)  
- Google Gemini 2.5 Flash  

---

##  Repository Structure

```text
Knowledge-Base-Search-Engine/
├── backend/               # FastAPI server, ChromaDB, and RAG logic
│   ├── main.py            
│   └── README.md          
├── frontend/              # React user interface
│   ├── src/               
│   └── README.md          
├── README.md              # Main documentation
└── .gitignore             
```

---

##  Getting Started

To run this application locally, you need to start both **backend and frontend servers**

---

###  Prerequisites

- Python 3.8+  
- Node.js 16+  
- Google Gemini API Key  

---

### 1️. Start the Backend

```bash
cd backend

python -m venv venv
venv\Scripts\activate   # Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
```

Create `.env` file:

```env
GOOGLE_API_KEY="your_key"
```

Run the server:

```bash
uvicorn main:app --reload
```

---

### 2️. Start the Frontend

```bash
cd frontend

npm install
npm run dev
```

---

### 3️. Use the Application

Open your browser:

```plaintext
http://localhost:5173
```

- Upload PDF or add text  
- Ask questions  
- Get AI-powered answers with sources  

---

##  How It Works (RAG Pipeline)

### 1️. Ingestion
- Documents are split into **1000-character chunks**
- Overlapping improves context understanding  

### 2️. Embedding
- Text → vector embeddings using HuggingFace  
- Stored locally in ChromaDB  

### 3️. Retrieval
- Query → vector  
- Uses **MMR (Max Marginal Relevance)**  
- Retrieves top relevant + diverse chunks  

### 4️. Synthesis
- Context + query → Gemini 2.5 Flash  
- Generates final answer with citations  

---

