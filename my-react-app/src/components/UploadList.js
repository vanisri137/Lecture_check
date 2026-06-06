import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      await axios.post(`${BACKEND_URI}/api/v1/media/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Video uploaded successfully.');
      fetchMedias();
      setTitle('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Error uploading video. Please try again.');
    }
  };

  const handleNext = () => {
    navigate('/upload');
  };

  return (
    <div className="upload-page">
  <div className="upload-form-card">
    <h2 className="section-title">Upload New Lecture</h2>

    <div className="form-group">
      <label>Lecture Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="form-control"
      />
    </div>

    <div className="form-group">
      <label>Select Video</label>
      <input
        type="file"
        className="form-control"
        onChange={handleFileChange}
      />
    </div>

    <button
      className="upload-submit-btn btn btn-warning"
      onClick={handleUpload}
    >
      Upload Lecture
    </button>

    <button
      className="btn btn-secondary mt-2"
      onClick={handleNext}
    >
      Next
    </button>
  </div>

  <div className="videos-section">
    <div className="section-title">
      Uploaded Lectures
      <span className="count-chip">
        ({medias.length})
      </span>
    </div>

    {medias.length === 0 ? (
      <div className="empty-state">
        <div className="empty-title">
          No lectures uploaded yet
        </div>
        <div className="empty-sub">
          Upload your first lecture video.
        </div>
      </div>
    ) : (
      <div className="videos-grid">
        {medias.map((media) => (
          <div key={media._id} className="video-card">
            <video width="100%" controls>
              <source
                src={`${BACKEND_URI}${media.videos[0]}`}
                type="video/mp4"
              />
            </video>

            <div className="video-info">
              <div className="video-title">
                {media.name}
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

