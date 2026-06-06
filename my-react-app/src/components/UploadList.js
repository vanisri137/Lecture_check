import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './upload.css';

const BACKEND_URI = process.env.REACT_APP_API_URL;

const UploadList = () => {
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [medias, setMedias] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMedias();
  }, []);

  const fetchMedias = async () => {
    try {
      const response = await axios.get(`${BACKEND_URI}/api/v1/media/all`);
      setMedias(response.data);
    } catch (error) {
      console.error('Error fetching medias:', error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || !title) {
      alert('Please select a file and enter a title.');
      return;
    }

    const formData = new FormData();
    formData.append('videos', selectedFile);
    formData.append('name', title);

    try {
      setIsUploading(true);
      await axios.post(`${BACKEND_URI}/api/v1/media/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Video uploaded successfully.');
      fetchMedias();
      setTitle('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Error uploading video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleNext = () => {
    navigate('/upload');
  };

  return (
    <div className="upload-page">

      {/* ── Left — Upload Form ── */}
      <div className="upload-form-card">

        <div className="upload-form-header">
          <div className="upload-step-tag">Step 1 of 3 — Lecture Video</div>
          <h2 className="upload-form-title">Upload New Lecture</h2>
          <p className="upload-form-sub">Add a lecture recording to begin similarity analysis</p>
        </div>

        <div className="upload-field-group">
          <label className="upload-field-label">Lecture Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="upload-field-input"
            placeholder="e.g. Week 8 — Neural Networks"
          />
        </div>

        <div className="upload-field-group">
          <label className="upload-field-label">Select Video</label>
          <div className="upload-file-wrap">
            <label className="upload-file-zone">
              <input
                type="file"
                className="upload-file-hidden"
                onChange={handleFileChange}
                accept="video/*"
              />
              <div className="upload-file-inner">
                <div className="upload-file-icon">
                  <i className="bi bi-cloud-upload-fill"></i>
                </div>
                {selectedFile ? (
                  <>
                    <span className="upload-file-name">{selectedFile.name}</span>
                    <span className="upload-file-replace">Click to replace</span>
                  </>
                ) : (
                  <>
                    <span className="upload-file-hint">Drop your video here</span>
                    <span className="upload-file-or">or <u>browse files</u></span>
                    <span className="upload-file-accept">MP4 · MOV · AVI · WEBM</span>
                  </>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Upload progress shimmer */}
        {isUploading && (
          <div className="upload-progress-wrap">
            <div className="upload-progress-track">
              <div className="upload-progress-fill"></div>
            </div>
            <span className="upload-progress-label">Uploading lecture…</span>
          </div>
        )}

        <div className="upload-btn-row">
          <button
            className="upload-submit-btn"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <><span className="upload-spinner"></span> Uploading…</>
            ) : (
              <><i className="bi bi-cloud-upload-fill"></i> Upload Lecture</>
            )}
          </button>

          <button
            className="upload-next-btn"
            onClick={handleNext}
          >
            Next <i className="bi bi-arrow-right"></i>
          </button>
        </div>

      </div>

      {/* ── Right — Video Grid ── */}
      <div className="videos-section">

        <div className="videos-section-header">
          <h3 className="videos-section-title">
            <span className="videos-title-dot"></span>
            Uploaded Lectures
          </h3>
          <span className="count-chip">{medias.length}</span>
        </div>

        {medias.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-wrap">
              <i className="bi bi-collection-play"></i>
            </div>
            <div className="empty-title">No lectures uploaded yet</div>
            <div className="empty-sub">Upload your first lecture video using the form.</div>
          </div>
        ) : (
          <div className="videos-grid">
            {medias.map((media) => (
              <div key={media._id} className="video-card">

                <div className="video-thumb">
                  <div className="video-thumb-bg"></div>
                  <video
                    className="video-player"
                    controls
                    preload="metadata"
                  >
                    <source
                      src={`${BACKEND_URI}${media.videos[0]}`}
                      type="video/mp4"
                    />
                  </video>
                </div>

                <div className="video-info">
                  <div className="video-title">{media.name}</div>
                  <div className="video-meta-row">
                    <span className="video-tag">
                      <i className="bi bi-play-circle"></i> Lecture
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};

export default UploadList;

