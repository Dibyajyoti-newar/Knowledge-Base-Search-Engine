#  RAG Backend Setup Guide

This guide will help you set up and run the **Knowledge-Base RAG FastAPI server** locally on your machine.

---

##  Prerequisites

- Python 3.8 or higher  
- Internet connection (for API calls and initial model download)  

---

##  Step 1: Get API Credentials

>  This project uses local ChromaDB + HuggingFace embeddings, so **Gemini is the only API key required**

1. Go to: https://aistudio.google.com/  
2. Sign in with your Google account  
3. Click **"Get API key"**  
4. Create a new API key  
5. Save it securely  

---

##  Step 2: Install Dependencies

Navigate to backend directory:

```bash
cd backend
```

### Create Virtual Environment

```bash
# Windows
python -m venv venv

# Mac/Linux
python3 -m venv venv
```

### Activate Virtual Environment

```bash
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### Install Requirements

```bash
pip install -r requirements.txt
```

---

##  Step 3: Configure Environment

Create a `.env` file in the backend directory:

```env
GOOGLE_API_KEY="your_gemini_api_key_here"
```

---

##  Step 4: Run the API Server

```bash
uvicorn main:app --reload
```

### Expected Output

```plaintext
INFO:     Will watch for changes in these directories
INFO:     Uvicorn running on http://127.0.0.1:8000
```

---

##  Step 5: Test the API

###  Option 1: Using curl

```bash
# Health check
curl http://127.0.0.1:8000/

# Add text
curl -X POST "http://127.0.0.1:8000/api/add-text" \
  -H "Content-Type: application/json" \
  -d "{
    \"text\": \"The mitochondria is the powerhouse of the cell.\",
    \"source_name\": \"Biology Wiki\"
  }"

# Query
curl -X POST "http://127.0.0.1:8000/api/query" \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"What does the mitochondria do?\"
  }"
```

---

###  Option 2: Using Python

Create a file `test_api.py`:

```python
import requests

BASE_URL = "http://127.0.0.1:8000"

# 1. Add text
print("Ingesting text...")
requests.post(
    f"{BASE_URL}/api/add-text",
    json={
        "text": "The mitochondria is the powerhouse of the cell.",
        "source_name": "Biology Wiki"
    }
)

# 2. Query
print("Querying...")
response = requests.post(
    f"{BASE_URL}/api/query",
    json={"query": "What does the mitochondria do?"}
)

print("Answer:", response.json()["answer"])
```

---

##  Common Issues

### 1. ModuleNotFoundError: fastapi

 Activate virtual environment before running:

```bash
venv\Scripts\activate
```

---

### 2. 429 RESOURCE_EXHAUSTED (Gemini API)

- Free quota exceeded  
- Wait or use another API key  

---

### 3. HuggingFace SSL Error

- Happens in restricted networks  
- Use mobile hotspot for first run  

---

##  Architecture Flow

```plaintext
┌─────────────────────────────────────┐
│         FastAPI Backend (main.py)   │
└──────────────────┬──────────────────┘
                   │
      ┌────────────┼─────────────┐
      │            │             │
┌─────▼──────┐ ┌───▼──────┐ ┌────▼────────┐
│ LangChain  │ │ ChromaDB │ │ Gemini LLM  │
│ Processor  │ │ Vector   │ │ (2.5 Flash) │
└────────────┘ └──────────┘ └─────────────┘
```

---
