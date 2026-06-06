import axios from 'axios';
import { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import './upload.css';

const BACKEND_URI = process.env.REACT_APP_API_URL;

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
      const result = await axios.get(`${BACKEND_URI}/get-files`);
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
      const result = await axios.post(`${BACKEND_URI}/upload-files`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
      const result = await axios.delete(`${BACKEND_URI}/delete-file/${pdfId}`);
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
    window.open(`${BACKEND_URI}/files/${pdf}`, "_blank", "noreferrer");
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
      return (
        <span className="pdf-status-badge pdf-status-uploading">
          <span className="pdf-status-dot"></span>Uploading…
        </span>
      );
    }
    if (uploadStatus === 'uploaded') {
      return (
        <span className="pdf-status-badge pdf-status-uploaded">
          <span className="pdf-status-dot"></span>Ready for Similarity Analysis
        </span>
      );
    }
    return (
      <span className="pdf-status-badge pdf-status-idle">
        <span className="pdf-status-dot"></span>Awaiting Upload
      </span>
    );
  };

  return (
    <div className="pdf-page">

      {/* ── Page header ── */}
      <div className="pdf-page-header">
        <div>
          <div className="pdf-step-tag">Step 2 of 3 — Reference Material</div>
          <h1 className="pdf-page-title">Reference PDF Upload</h1>
          <p className="pdf-page-sub">
            Upload lecture reference PDFs to compare against recordings using semantic similarity analysis.
          </p>
        </div>
        {getStatusBadge()}
      </div>

      {/* ── Two-column main ── */}
      <main className="pdf-main-grid">

        {/* ════ LEFT — Upload form ════ */}
        <section className="pdf-upload-card">

          <div className="pdf-card-label">
            <i className="bi bi-cloud-arrow-up-fill"></i>
            Upload Document
          </div>

          <form onSubmit={submitPdf} className="pdf-form">

            {/* Title field */}
            <div className="pdf-field-group">
              <label className="pdf-field-label">Document Title</label>
              <input
                type="text"
                className="pdf-field-input"
                placeholder="e.g. Week 8 — Neural Networks Notes"
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Drag-and-drop zone */}
            <div className="pdf-field-group">
              <label className="pdf-field-label">PDF File</label>
              <div
                className={`pdf-dropzone${isDragging ? ' pdf-dropzone--active' : ''}${file ? ' pdf-dropzone--filled' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="pdf-file-hidden"
                  accept="application/pdf"
                  required
                  onChange={(e) => { setFile(e.target.files[0]); setUploadStatus(null); }}
                />

                {file ? (
                  <div className="pdf-dropzone-filled">
                    <div className="pdf-file-icon-wrap pdf-file-icon-wrap--filled">
                      <i className="bi bi-file-earmark-pdf-fill"></i>
                    </div>
                    <div className="pdf-dropzone-filename">{file.name}</div>
                    <div className="pdf-dropzone-replace">Click to replace</div>
                  </div>
                ) : (
                  <div className="pdf-dropzone-empty">
                    <div className="pdf-file-icon-wrap">
                      <i className="bi bi-file-earmark-arrow-up"></i>
                    </div>
                    <p className="pdf-dropzone-hint">Drag &amp; drop a PDF here</p>
                    <p className="pdf-dropzone-or">or <span className="pdf-browse-link">browse files</span></p>
                    <span className="pdf-dropzone-accept">PDF only — up to 50 MB</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress bar */}
            {uploadStatus === 'uploading' && (
              <div className="pdf-progress-wrap">
                <div className="pdf-progress-track">
                  <div className="pdf-progress-fill"></div>
                </div>
                <span className="pdf-progress-label">Uploading &amp; processing…</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="pdf-btn-row">
              <button
                type="button"
                className="pdf-btn pdf-btn--back"
                onClick={handleBack}
              >
                <i className="bi bi-arrow-left"></i> Back
              </button>

              <button
                type="submit"
                className="pdf-btn pdf-btn--upload"
                disabled={uploadStatus === 'uploading'}
              >
                {uploadStatus === 'uploading' ? (
                  <><span className="pdf-spinner"></span>Uploading…</>
                ) : (
                  <><i className="bi bi-cloud-upload-fill"></i> Upload PDF</>
                )}
              </button>

              <button
                type="button"
                className="pdf-btn pdf-btn--next"
                onClick={handleNext}
                disabled={similarityScore === null}
              >
                Analyse <i className="bi bi-arrow-right"></i>
              </button>
            </div>

          </form>
        </section>

        {/* ════ RIGHT — PDF library panel ════ */}
        <section className="pdf-library-card">

          <div className="pdf-library-header">
            <div className="pdf-library-icon">
              <i className="bi bi-bookmarks-fill"></i>
            </div>
            <div>
              <h2 className="pdf-library-title">Reference Library</h2>
              <p className="pdf-library-sub">
                {allPdf === null
                  ? 'Loading…'
                  : `${allPdf.length} document${allPdf.length !== 1 ? 's' : ''} uploaded`}
              </p>
            </div>
          </div>

          <div className="pdf-list">
            {allPdf === null ? (
              <div className="pdf-list-loading">
                <span className="pdf-spinner pdf-spinner--sm"></span>
                <span>Loading documents…</span>
              </div>
            ) : allPdf.length === 0 ? (
              <div className="pdf-list-empty">
                <div className="pdf-empty-icon-wrap">
                  <i className="bi bi-file-earmark-pdf"></i>
                </div>
                <p className="pdf-empty-text">No documents yet. Upload your first PDF!</p>
              </div>
            ) : (
              allPdf.map((data, idx) => (
                <div
                  className="pdf-list-item"
                  key={data._id}
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="pdf-item-icon">
                    <i className="bi bi-file-earmark-pdf-fill"></i>
                  </div>
                  <div className="pdf-item-meta">
                    <span className="pdf-item-name">{data.title || data.pdf}</span>
                    <span className="pdf-item-tag">Reference material</span>
                  </div>
                  <div className="pdf-item-actions">
                    <button
                      className="pdf-icon-btn pdf-icon-btn--view"
                      onClick={() => showPdf(data.pdf)}
                      title="Preview PDF"
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button
                      className="pdf-icon-btn pdf-icon-btn--del"
                      onClick={() => deletePdf(data._id)}
                      title="Delete PDF"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pdf-library-footer">
            <i className="bi bi-info-circle"></i>
            <span>Uploaded PDFs are used as reference benchmarks for semantic similarity scoring.</span>
          </div>

        </section>
      </main>
    </div>
  );
}

export default Upload;
