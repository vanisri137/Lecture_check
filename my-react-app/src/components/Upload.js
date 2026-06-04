import axios from 'axios';
import { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import './upload.css';
 
function Upload() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [allPdf, setAllPdf] = useState(null);
  const [similarityScore, setSimilarityScore] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null); // null | 'uploading' | 'uploaded'
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
 
  useEffect(() => {
    getPdf();
  }, []);
 
  const getPdf = async () => {
    try {
      const result = await axios.get("http://localhost:5000/get-files");
      setAllPdf(result.data.data);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    }
  };
 
  const submitPdf = async (e) => {
    e.preventDefault();
    setUploadStatus('uploading');
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    try {
      const result = await axios.post(
        "http://localhost:5000/upload-files",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (result.data.status === "ok") {
        alert("Uploaded Successfully!!!!!");
        setUploadStatus('uploaded');
        setSimilarityScore(result.data.similarityScore);
        getPdf();
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Error uploading PDF. Please try again.');
      setUploadStatus(null);
    }
  };
 
  const deletePdf = async (pdfId) => {
    try {
      const result = await axios.delete(`http://localhost:5000/delete-file/${pdfId}`);
      if (result.data.status === "ok") {
        alert("Deleted Successfully!!!!!");
        setAllPdf(allPdf.filter((pdf) => pdf._id !== pdfId));
      } else {
        alert('Error deleting PDF. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting PDF:', error);
      alert('Error deleting PDF. Please try again.');
    }
  };
 
  const showPdf = (pdf) => {
    window.open(`http://localhost:5000/files/${pdf}`, "_blank", "noreferrer");
  };
 
  const handleBack = () => {
    navigate('/uploadvd');
  };
 
  const handleNext = () => {
    navigate('/similarity-score', { state: { similarityScore } });
  };
 
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
 
  const handleDragLeave = () => {
    setIsDragging(false);
  };
 
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setUploadStatus(null);
    } else {
      alert('Please drop a PDF file.');
    }
  };
 
  const getStatusBadge = () => {
    if (uploadStatus === 'uploading') {
      return <span className="status-badge status-uploading"><span className="status-dot"></span>Uploading…</span>;
    }
    if (uploadStatus === 'uploaded') {
      return <span className="status-badge status-uploaded"><span className="status-dot"></span>Ready for Similarity Analysis</span>;
    }
    return <span className="status-badge status-idle"><span className="status-dot"></span>Awaiting Upload</span>;
  };
 
  return (
    <div className="lc-root">
 
      {/* ── Background grid + blobs ── */}
      <div className="lc-bg-grid" aria-hidden="true"></div>
      <div className="lc-blob lc-blob-1" aria-hidden="true"></div>
      <div className="lc-blob lc-blob-2" aria-hidden="true"></div>
 
      {/* ── Top nav strip ── */}
      <header className="lc-header">
        <div className="lc-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="28" height="28" rx="7" fill="#ffc107"/>
            <path d="M7 9h14M7 14h10M7 19h12" stroke="#212529" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>LectureCheck</span>
        </div>
        <nav className="lc-nav-pills">
          <span className="lc-pill lc-pill-active">Upload</span>
          <span className="lc-pill">Analyse</span>
          <span className="lc-pill">Reports</span>
        </nav>
      </header>
 
      {/* ── Hero ── */}
      <section className="lc-hero">
        <div className="lc-hero-text">
          <p className="lc-hero-tag">Step 2 of 3 — Reference Material</p>
          <h1 className="lc-hero-title">Reference Material Upload</h1>
          <p className="lc-hero-sub">
            Upload lecture reference PDFs to compare against lecture recordings using
            semantic&nbsp;similarity analysis.
          </p>
          {getStatusBadge()}
        </div>
 
        {/* Education illustration */}
        <div className="lc-hero-illo" aria-hidden="true">
          <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="lc-illo-svg">
            {/* Desk */}
            <rect x="40" y="160" width="240" height="10" rx="4" fill="#2c3137"/>
            <rect x="60" y="170" width="8" height="30" rx="3" fill="#2c3137"/>
            <rect x="252" y="170" width="8" height="30" rx="3" fill="#2c3137"/>
 
            {/* Stack of books */}
            <rect x="44" y="130" width="54" height="32" rx="4" fill="#ffc107" opacity="0.9"/>
            <rect x="48" y="126" width="50" height="32" rx="4" fill="#e6ac00"/>
            <rect x="52" y="122" width="46" height="32" rx="4" fill="#ffd454"/>
            <line x1="58" y1="130" x2="90" y2="130" stroke="#c49600" strokeWidth="1.5"/>
            <line x1="58" y1="136" x2="88" y2="136" stroke="#c49600" strokeWidth="1.5"/>
            <line x1="58" y1="142" x2="86" y2="142" stroke="#c49600" strokeWidth="1.5"/>
 
            {/* Laptop / monitor */}
            <rect x="110" y="108" width="100" height="62" rx="6" fill="#212529" stroke="#495057" strokeWidth="2"/>
            <rect x="116" y="114" width="88" height="50" rx="3" fill="#1a1e21"/>
            {/* Screen glow */}
            <rect x="120" y="118" width="80" height="42" rx="2" fill="url(#screenGrad)"/>
            {/* Code lines on screen */}
            <line x1="126" y1="126" x2="158" y2="126" stroke="#ffc107" strokeWidth="2" strokeLinecap="round"/>
            <line x1="126" y1="132" x2="172" y2="132" stroke="#6c757d" strokeWidth="2" strokeLinecap="round"/>
            <line x1="126" y1="138" x2="163" y2="138" stroke="#6c757d" strokeWidth="2" strokeLinecap="round"/>
            <line x1="126" y1="144" x2="150" y2="144" stroke="#ffc107" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="126" y1="150" x2="168" y2="150" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round"/>
            {/* Laptop base */}
            <rect x="100" y="170" width="120" height="6" rx="3" fill="#343a40" stroke="#495057" strokeWidth="1.5"/>
 
            {/* Floating PDF document */}
            <g className="lc-illo-float">
              <rect x="228" y="100" width="52" height="66" rx="5" fill="#2c3137" stroke="#495057" strokeWidth="1.5"/>
              <path d="M228 110 h52" stroke="#495057" strokeWidth="1"/>
              <path d="M252 100 v10" stroke="#495057" strokeWidth="1"/>
              <path d="M246 100 l6-8 h28 a4 4 0 0 1 4 4 v70 a4 4 0 0 1-4 4" stroke="none" fill="none"/>
              <text x="234" y="124" fontSize="9" fill="#ffc107" fontWeight="bold" fontFamily="monospace">PDF</text>
              <line x1="234" y1="130" x2="270" y2="130" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="234" y1="137" x2="268" y2="137" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="234" y1="144" x2="263" y2="144" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="234" y1="151" x2="267" y2="151" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round"/>
            </g>
 
            {/* Person (teacher) */}
            {/* Head */}
            <circle cx="168" cy="72" r="16" fill="#fcd5a8"/>
            {/* Hair */}
            <path d="M152 68 q0-20 16-20 q16 0 16 20" fill="#343a40"/>
            {/* Body */}
            <rect x="152" y="88" width="32" height="24" rx="5" fill="#495057"/>
            {/* Collar */}
            <path d="M164 88 l4 8 l4-8" stroke="#fff" strokeWidth="1.5" fill="none"/>
            {/* Arms */}
            <path d="M152 92 q-10 8-14 20" stroke="#495057" strokeWidth="8" strokeLinecap="round"/>
            <path d="M184 92 q10 8 14 20" stroke="#495057" strokeWidth="8" strokeLinecap="round"/>
 
            {/* AI spark / stars */}
            <g className="lc-illo-spark">
              <circle cx="84" cy="90" r="3" fill="#ffc107" opacity="0.85"/>
              <circle cx="92" cy="82" r="2" fill="#ffc107" opacity="0.6"/>
              <circle cx="78" cy="80" r="1.5" fill="#ffc107" opacity="0.5"/>
            </g>
            <g className="lc-illo-spark2">
              <circle cx="220" cy="78" r="3" fill="#ffc107" opacity="0.8"/>
              <circle cx="228" cy="68" r="2" fill="#ffc107" opacity="0.55"/>
            </g>
 
            <defs>
              <linearGradient id="screenGrad" x1="120" y1="118" x2="200" y2="160" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1e2428"/>
                <stop offset="100%" stopColor="#252b30"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>
 
      {/* ── Main two-column workspace ── */}
      <main className="lc-workspace">
 
        {/* ════ LEFT — Upload card ════ */}
        <section className="lc-card lc-upload-card">
          <div className="lc-card-header">
            <svg className="lc-card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16V8m0 0-3 3m3-3 3 3" stroke="#ffc107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 16.7A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" stroke="#ffc107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <h2 className="lc-card-title">Upload Reference PDF</h2>
              <p className="lc-card-subtitle">Supported format: .pdf · Max 50 MB</p>
            </div>
          </div>
 
          <form className="lc-form" onSubmit={submitPdf}>
            {/* Title field */}
            <div className="lc-field">
              <label className="lc-label" htmlFor="pdf-title">Document Title</label>
              <input
                id="pdf-title"
                type="text"
                className="lc-input"
                placeholder="e.g. Week 4 — Neural Networks"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
 
            {/* Drag-and-drop zone */}
            <div className="lc-field">
              <label className="lc-label">PDF File</label>
              <div
                className={`lc-dropzone${isDragging ? ' lc-dropzone-active' : ''}${file ? ' lc-dropzone-filled' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="lc-file-hidden"
                  accept="application/pdf"
                  required
                  onChange={(e) => { setFile(e.target.files[0]); setUploadStatus(null); }}
                />
                {file ? (
                  <div className="lc-dropzone-filled-content">
                    <svg viewBox="0 0 24 24" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#ffc107" strokeWidth="2" fill="none"/>
                      <polyline points="14 2 14 8 20 8" stroke="#ffc107" strokeWidth="2" fill="none"/>
                      <text x="7" y="18" fontSize="5.5" fill="#ffc107" fontWeight="bold" fontFamily="monospace">PDF</text>
                    </svg>
                    <div className="lc-dropzone-filename">{file.name}</div>
                    <div className="lc-dropzone-replace">Click to replace</div>
                  </div>
                ) : (
                  <div className="lc-dropzone-empty-content">
                    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#6c757d" strokeWidth="2" fill="none"/>
                      <polyline points="14 2 14 8 20 8" stroke="#6c757d" strokeWidth="2" fill="none"/>
                      <line x1="12" y1="18" x2="12" y2="12" stroke="#6c757d" strokeWidth="2" strokeLinecap="round"/>
                      <polyline points="9 15 12 12 15 15" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p className="lc-dropzone-hint">Drag & drop a PDF here</p>
                    <p className="lc-dropzone-or">or <span>browse files</span></p>
                  </div>
                )}
              </div>
            </div>
 
            {/* Upload progress bar (shown while uploading) */}
            {uploadStatus === 'uploading' && (
              <div className="lc-progress-wrap">
                <div className="lc-progress-bar">
                  <div className="lc-progress-fill"></div>
                </div>
                <span className="lc-progress-label">Uploading & processing…</span>
              </div>
            )}
 
            {/* Action buttons */}
            <div className="lc-btn-row">
              <button
                type="button"
                className="lc-btn lc-btn-back"
                onClick={handleBack}
              >
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none"><path d="M13 16l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Back
              </button>
              <button
                type="submit"
                className="lc-btn lc-btn-upload"
                disabled={uploadStatus === 'uploading'}
              >
                {uploadStatus === 'uploading' ? (
                  <><span className="lc-spinner"></span>Uploading…</>
                ) : (
                  <><svg viewBox="0 0 20 20" width="16" height="16" fill="none"><path d="M10 14V6m0 0L7 9m3-3 3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Upload PDF</>
                )}
              </button>
              <button
                type="button"
                className="lc-btn lc-btn-next"
                onClick={handleNext}
                disabled={similarityScore === null}
              >
                Analyse
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none"><path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </form>
        </section>
 
        {/* ════ RIGHT — Uploaded PDFs panel ════ */}
        <section className="lc-card lc-library-card">
          <div className="lc-card-header">
            <svg className="lc-card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#ffc107" strokeWidth="2" strokeLinecap="round"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#ffc107" strokeWidth="2"/>
            </svg>
            <div>
              <h2 className="lc-card-title">Reference Library</h2>
              <p className="lc-card-subtitle">
                {allPdf === null
                  ? 'Loading…'
                  : `${allPdf.length} document${allPdf.length !== 1 ? 's' : ''} uploaded`}
              </p>
            </div>
          </div>
 
          <div className="lc-pdf-list">
            {allPdf === null ? (
              <div className="lc-list-loading">
                <span className="lc-spinner lc-spinner-sm"></span>
                <span>Loading documents…</span>
              </div>
            ) : allPdf.length === 0 ? (
              <div className="lc-list-empty">
                <svg viewBox="0 0 48 48" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="6" width="28" height="36" rx="4" stroke="#495057" strokeWidth="2"/>
                  <line x1="16" y1="16" x2="32" y2="16" stroke="#495057" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="16" y1="22" x2="32" y2="22" stroke="#495057" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="16" y1="28" x2="26" y2="28" stroke="#495057" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <p>No documents yet. Upload your first PDF!</p>
              </div>
            ) : (
              allPdf.map((data, idx) => (
                <div
                  className="lc-pdf-item"
                  key={data._id}
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="lc-pdf-icon-wrap">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#ffc107" strokeWidth="2" fill="none"/>
                      <polyline points="14 2 14 8 20 8" stroke="#ffc107" strokeWidth="2" fill="none"/>
                      <text x="7.5" y="18" fontSize="4.5" fill="#ffc107" fontWeight="bold" fontFamily="monospace">PDF</text>
                    </svg>
                  </div>
                  <div className="lc-pdf-meta">
                    <span className="lc-pdf-name">{data.title || data.pdf}</span>
                    <span className="lc-pdf-tag">Reference material</span>
                  </div>
                  <div className="lc-pdf-actions">
                    <button
                      className="lc-icon-btn lc-icon-btn-view"
                      onClick={() => showPdf(data.pdf)}
                      title="Preview PDF"
                    >
                      <svg viewBox="0 0 20 20" width="15" height="15" fill="none"><path d="M10 4C5.5 4 2 10 2 10s3.5 6 8 6 8-6 8-6-3.5-6-8-6z" stroke="currentColor" strokeWidth="2"/><circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="2"/></svg>
                    </button>
                    <button
                      className="lc-icon-btn lc-icon-btn-del"
                      onClick={() => deletePdf(data._id)}
                      title="Delete PDF"
                    >
                      <svg viewBox="0 0 20 20" width="15" height="15" fill="none"><path d="M4 6h12M8 6V4h4v2M9 10v5M11 10v5M5 6l1 10a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
 
          {/* Info footer */}
          <div className="lc-library-footer">
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none"><circle cx="10" cy="10" r="8" stroke="#6c757d" strokeWidth="2"/><line x1="10" y1="9" x2="10" y2="14" stroke="#6c757d" strokeWidth="2" strokeLinecap="round"/><circle cx="10" cy="6.5" r="1" fill="#6c757d"/></svg>
            <span>Uploaded PDFs are used as reference benchmarks for semantic similarity scoring.</span>
          </div>
        </section>
      </main>
    </div>
  );
}
 
export default Upload;
