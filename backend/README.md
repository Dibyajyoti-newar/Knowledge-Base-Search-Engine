# 📚 Knowledge-Base RAG API

A **Retrieval-Augmented Generation (RAG)** backend API built with **FastAPI**.  
It processes PDF documents and raw text, stores them securely in a local vector database, and uses **Google Gemini** to synthesize highly accurate answers to user queries.

---

##  Features

- **Multi-Modal Ingestion**: Upload PDF files directly or ingest raw text with custom source identifiers.
- **Intelligent Document Parsing**: Automatic text splitting *(1000 tokens with 200 token overlap)* using LangChain's `RecursiveCharacterTextSplitter`.
- **Local Vector Storage**: Privacy-first vector database powered by ChromaDB. No cloud database required.
- **Open-Source Embeddings**: High-quality embeddings using HuggingFace's `all-MiniLM-L6-v2`.
- **Advanced Retrieval**: Uses **MMR (Max Marginal Relevance)** for diverse and relevant results.
- **LLM Integration**: Powered by Google's `gemini-2.5-flash`.
- **RESTful Architecture**: Clean and fast API built with FastAPI.

---

## Architecture

```plaintext
Document Upload (PDF / Text)
        ↓
LangChain Processor (Text Splitting)
        ↓
HuggingFace Embeddings (all-MiniLM-L6-v2)
        ↓
ChromaDB (Local Persistent Vector Store)
        ↓
User Query → MMR Similarity Search → Retrieved Context
        ↓
Google Gemini 2.5 Flash LLM
        ↓
Final Answer + Sources (JSON)
```

---

##  Prerequisites

- Python 3.8+
- Google Gemini API Key

---

##  Setup Instructions

### 1. Install Dependencies

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

```bash
pip install -r requirements.txt
```

---

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
GOOGLE_API_KEY="your_gemini_api_key_here"
```

---

### 3. Start the Server

```bash
uvicorn main:app --reload
```

- API: http://127.0.0.1:8000  
- Docs: http://127.0.0.1:8000/docs  

---

##  API Endpoints

### 1️. Health Check

```bash
GET /
```

**Response:**
```json
{
  "status": "Full RAG Backend is running!"
}
```

---

### 2. Upload PDF Document

```bash
POST /api/upload
Content-Type: multipart/form-data
```

**Parameters:**
- `file`: PDF file

**Response:**
```json
{
  "message": "Successfully processed document.pdf",
  "total_chunks_created": 19
}
```

---

### 3. Ingest Raw Text

```bash
POST /api/add-text
Content-Type: application/json
```

**Payload:**
```json
{
  "text": "The mitochondria is the powerhouse of the cell...",
  "source_name": "Biology Wiki"
}
```

**Response:**
```json
{
  "message": "Successfully processed text: Biology Wiki",
  "total_chunks_created": 2
}
```

---

### 4. Query the Knowledge Base

```bash
POST /api/query
Content-Type: application/json
```

**Payload:**
```json
{
  "query": "What is the function of the mitochondria?"
}
```

**Response:**
```json
{
  "answer": "The mitochondria acts as the powerhouse of the cell...",
  "sources": [
    {
      "page": "Biology Wiki",
      "snippet": "The mitochondria is the powerhouse of the cell..."
    }
  ]
}
```

---

##  Built With

- **FastAPI** – High-performance API framework  
- **LangChain** – LLM application framework  
- **ChromaDB** – Vector database  
- **HuggingFace** – Embedding models  
- **Google Generative AI** – Gemini LLM  
