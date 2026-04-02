from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.documents import Document 
import os
import shutil
from dotenv import load_dotenv
import ssl 
import httpx 

# SSL Workaround for Strict Firewalls 
# 1. Disable standard SSL verification globally
ssl._create_default_https_context = ssl._create_unverified_context

# 2.  HuggingFace to use a custom client that ignores SSL
os.environ['CURL_CA_BUNDLE'] = ''
os.environ['REQUESTS_CA_BUNDLE'] = ''
os.environ['SSL_CERT_FILE'] = ''


load_dotenv()

app = FastAPI(title="Knowledge Base Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vector_store = Chroma(embedding_function=embeddings, persist_directory="./chroma_db")


llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.3)
class QueryRequest(BaseModel):
    query: str

# Model for accepting raw text
class TextInput(BaseModel):
    text: str
    source_name: str = "Manual Text Entry"

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported for now.")
    
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        loader = PyPDFLoader(file_path)
        docs = loader.load()
        
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splits = text_splitter.split_documents(docs)
        vector_store.add_documents(documents=splits)
        os.remove(file_path)
        
        return {"message": f"Successfully processed {file.filename}", "total_chunks_created": len(splits)}
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")

# Endpoint to accept raw text paragraphs
@app.post("/api/add-text")
async def add_raw_text(data: TextInput):
    try:
        if not data.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty.")
            
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        
        # Manually create LangChain Document objects from the raw string
        docs = [Document(page_content=data.text, metadata={"page": data.source_name})]
        splits = text_splitter.split_documents(docs)
        
        vector_store.add_documents(documents=splits)
        
        return {"message": f"Successfully processed text: {data.source_name}", "total_chunks_created": len(splits)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding text: {str(e)}")

@app.post("/api/query")
async def query_knowledge_base(request: QueryRequest):
    try:
        # MMR for better retrieval accuracy and diversity
        # fetch_k=20 means it grabs the top 20 matches, then selects the 5 most diverse ones
        results = vector_store.max_marginal_relevance_search(request.query, k=5, fetch_k=20)
        
        if not results:
            return {"answer": "I don't have any relevant documents to answer that.", "sources": []}

        context = "\n\n".join([doc.page_content for doc in results])
        
        prompt = f"""Using these documents, answer the user's question succinctly.
        
        Documents:
        {context}
        
        User's Question: {request.query}
        """
        
        response = llm.invoke(prompt)
        sources = [{"page": doc.metadata.get("page", "Unknown"), "snippet": doc.page_content[:100] + "..."} for doc in results]
        
        return {"answer": response.content, "sources": sources}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during query: {str(e)}")

@app.get("/")
def read_root():
    return {"status": "Full RAG Backend is running!"}