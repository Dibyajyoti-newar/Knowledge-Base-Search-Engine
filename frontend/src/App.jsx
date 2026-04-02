import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  
  const [rawText, setRawText] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const [textStatus, setTextStatus] = useState('');
  
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  //API Handlers
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a PDF file first.');
    const formData = new FormData();
    formData.append('file', file);
    try {
      setUploadStatus('Uploading & vectorizing...');
      const response = await axios.post('http://127.0.0.1:8000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadStatus(` Success! ${response.data.total_chunks_created} chunks added.`);
      setFile(null);
    } catch (error) {
      setUploadStatus(' Error processing PDF.');
    }
  };

  const handleAddText = async (e) => {
    e.preventDefault();
    if (!rawText) return alert('Please enter some text.');
    try {
      setTextStatus('Vectorizing text...');
      const response = await axios.post('http://127.0.0.1:8000/api/add-text', {
        text: rawText,
        source_name: textTitle || "Manual Text Entry"
      });
      setTextStatus(` Success! ${response.data.total_chunks_created} chunks added.`);
      setRawText(''); 
      setTextTitle('');
    } catch (error) {
      setTextStatus(' Error adding text.');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return alert('Please enter a query.');
    setLoading(true);
    setAnswer('');
    setSources([]);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/query', { query });
      setAnswer(response.data.answer);
      setSources(response.data.sources);
    } catch (error) {
      const errorDetail = error.response?.data?.detail || error.message;
      setAnswer(` Backend Error: ${errorDetail}`);
    } finally {
      setLoading(false);
    }
  };

  // UI Layout
  return (
    <div className="container">
      {/* Header Section */}
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>
          <span className="gradient-text">Knowledge-Base</span> Search Engine
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: '0 auto', maxWidth: '600px' }}>
          Upload documents and raw text into a local Vector Database. 
          Ask complex questions and let AI synthesize answers using highly relevant Retrieval-Augmented Generation (RAG).
        </p>
      </header>
      
      {/* Ingestion Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        {/* PDF Card */}
        <div className="card">
          <h2 style={{ marginTop: 0, fontSize: '1.25rem', color: '#f8fafc' }}>
              Upload PDF
          </h2>
          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={(e) => setFile(e.target.files[0])} 
              className="input-field"
              style={{ cursor: 'pointer' }}
            />
            <button type="submit" className="btn btn-primary">Vectorize Document</button>
          </form>
          {uploadStatus && <p style={{ fontSize: '0.85rem', marginTop: '1rem', color: uploadStatus.includes('') ? '#ef4444' : '#10b981' }}>{uploadStatus}</p>}
        </div>

        {/* Text Card */}
        <div className="card">
          <h2 style={{ marginTop: 0, fontSize: '1.25rem', color: '#f8fafc' }}>
              Ingest Raw Text
          </h2>
          <form onSubmit={handleAddText} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" 
              value={textTitle} 
              onChange={(e) => setTextTitle(e.target.value)} 
              placeholder="Source identifier (e.g., Wiki Article)" 
              className="input-field"
            />
            <textarea 
              value={rawText} 
              onChange={(e) => setRawText(e.target.value)} 
              placeholder="Paste context paragraphs here..." 
              rows="3" 
              className="input-field"
              style={{ resize: 'vertical' }}
            />
            <button type="submit" className="btn btn-primary" style={{ backgroundImage: 'linear-gradient(135deg, #a855f7, #6366f1)' }}>Vectorize Text</button>
          </form>
          {textStatus && <p style={{ fontSize: '0.85rem', marginTop: '1rem', color: textStatus.includes('') ? '#ef4444' : '#10b981' }}>{textStatus}</p>}
        </div>
      </div>

      {/* Search Engine Section */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ marginTop: 0, fontSize: '1.25rem', color: '#f8fafc' }}>
              Ask Your Question
          </h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Query your knowledge base..." 
            className="input-field"
            style={{ fontSize: '1.1rem', padding: '1rem' }}
          />
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', whiteSpace: 'nowrap' }}>
            {loading ? 'Synthesizing...' : 'Search'}
          </button>
        </form>

        {/* AI Response Area */}
        {answer && (
          <div className="fade-in" style={{ marginTop: '2.5rem', borderTop: '1px solid #334155', paddingTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}></span>
              <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.25rem' }}>Answer</h3>
            </div>
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#e2e8f0', background: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
              {answer}
            </p>
            
            {/* Sources */}
            {sources.length > 0 && (
              <div style={{ marginTop: '2.5rem' }}>
                <h4 style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
                  Retrieved Context (Top MMR Hits)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {sources.map((source, index) => (
                    <div key={index} className="source-pill">
                      <span style={{ color: '#8b5cf6', fontWeight: '600', marginRight: '0.5rem' }}>[{source.page}]:</span> 
                      {source.snippet}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;